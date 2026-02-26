import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  arrayUnion, 
  increment,
  query,
  where
} from 'firebase/firestore';

export type Role = 'Nhà báo' | 'Công nhân' | 'Nông dân' | 'Tiểu thương';

export interface Player {
  id: string;
  name: string;
  role: Role;
  teamId: string | null;
  score: number; // Individual score
  streak: number; // Combo streak
  badges: string[]; // Combo achievement badges
  canSteal: boolean; // Can steal points from other teams
  lastStealTime: number; // Timestamp of last steal
}

export interface Team {
  id: string;
  name: string;
  fund: number;
  members: string[]; // player IDs
}

export interface DuelChallenge {
  id: string;
  player1Id: string;
  player2Id: string;
  questionId: string;
  player1Answer: number | null;
  player2Answer: number | null;
  winnerId: string | null;
  timestamp: number;
  status: 'waiting' | 'answered' | 'completed';
}

export interface TeamMission {
  id: string;
  teamId: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  timeLimit: number;
  startTime: number;
  reward: number;
  status: 'active' | 'completed' | 'failed';
}

export interface GameRoom {
  pin: string;
  status: 'waiting' | 'playing' | 'finished';
  players: Record<string, Player>;
  teams: Record<string, Team>;
  events: Array<{ message: string; timestamp: number; type?: string }>;
  startTime?: number;
  endTime?: number;
  currentDuels?: Record<string, DuelChallenge>;
  teamMissions?: Record<string, TeamMission>;
  doublePointsUntil?: number;
  firstCorrectBonus?: number;
}

export const ROLES: Role[] = ['Nhà báo', 'Công nhân', 'Nông dân', 'Tiểu thương'];

export function useGameRoom(pin: string) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pin) return;
    
    const unsubscribe = onSnapshot(doc(db, 'rooms', pin), (docSnap) => {
      if (docSnap.exists()) {
        setRoom(docSnap.data() as GameRoom);
      } else {
        setRoom(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pin]);

  return { room, loading };
}

export async function createRoom(): Promise<string> {
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  await setDoc(doc(db, 'rooms', pin), {
    pin,
    status: 'waiting',
    players: {},
    teams: {},
    events: [],
    currentDuels: {}
  });
  return pin;
}

export async function joinRoom(pin: string, name: string): Promise<Player | null> {
  const roomRef = doc(db, 'rooms', pin);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) return null;
  
  const roomData = roomSnap.data() as GameRoom;
  
  // Prevent joining if game already started
  if (roomData.status === 'playing' || roomData.status === 'finished') {
    return null;
  }
  
  // Don't assign role yet, just add player
  const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  
  const newPlayer: Player = {
    id: playerId,
    name,
    role: 'Nhà báo', // Temporary, will be assigned when game starts
    teamId: null,
    score: 0,
    streak: 0,
    badges: [],
    canSteal: false,
    lastStealTime: 0
  };

  await updateDoc(roomRef, {
    [`players.${playerId}`]: newPlayer
  });

  return newPlayer;
}

export async function startGame(pin: string) {
  const roomRef = doc(db, 'rooms', pin);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) return;
  
  const roomData = roomSnap.data() as GameRoom;
  const playerIds = Object.keys(roomData.players || {});
  
  // Shuffle players
  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
  
  // Create teams of 4
  const teams: Record<string, Team> = {};
  const updatedPlayers: Record<string, Player> = { ...roomData.players };
  
  let teamIndex = 0;
  for (let i = 0; i < shuffled.length; i += 4) {
    const teamMembers = shuffled.slice(i, i + 4);
    
    if (teamMembers.length === 0) continue;
    
    const teamId = `team_${teamIndex + 1}`;
    const teamName = `Đội ${teamIndex + 1}`;
    
    teams[teamId] = {
      id: teamId,
      name: teamName,
      fund: 0,
      members: teamMembers
    };
    
    // Assign roles within team (1 of each role)
    teamMembers.forEach((playerId, idx) => {
      updatedPlayers[playerId].teamId = teamId;
      updatedPlayers[playerId].role = ROLES[idx % 4]; // Cycle through roles
    });
    
    teamIndex++;
  }
  
  // Set game start time (5 minutes = 300 seconds)
  const startTime = Date.now();
  const endTime = startTime + (5 * 60 * 1000); // 5 minutes from now
  
  await updateDoc(roomRef, {
    status: 'playing',
    players: updatedPlayers,
    teams: teams,
    startTime: startTime,
    endTime: endTime
  });
}

export async function answerQuizCorrect(pin: string, playerId: string, teamId: string) {
  const roomRef = doc(db, 'rooms', pin);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) return;
  
  const roomData = roomSnap.data() as GameRoom;
  const player = roomData.players[playerId];
  const team = roomData.teams[teamId];
  const newStreak = (player.streak || 0) + 1;
  
  // Combo multiplier: 3+ streak = x2, 5+ streak = x3, 7+ = x4, 10+ = x5
  let points = 1;
  if (newStreak >= 10) points = 5;
  else if (newStreak >= 7) points = 4;
  else if (newStreak >= 5) points = 3;
  else if (newStreak >= 3) points = 2;
  
  // Check for double points event
  if (roomData.doublePointsUntil && Date.now() < roomData.doublePointsUntil) {
    points = points * 2;
  }
  
  // Check for first correct bonus
  if (roomData.firstCorrectBonus && roomData.firstCorrectBonus > 0) {
    points += roomData.firstCorrectBonus;
    await updateDoc(roomRef, { firstCorrectBonus: 0 });
  }
  
  const updates: any = {
    [`teams.${teamId}.fund`]: increment(points),
    [`players.${playerId}.score`]: increment(points),
    [`players.${playerId}.streak`]: newStreak
  };
  
  // Award badges and trigger events
  if (newStreak === 3) {
    updates[`players.${playerId}.badges`] = arrayUnion('combo_3');
    updates[`players.${playerId}.canSteal`] = true;
    await triggerEvent(pin, `🎖️ ${player.name} đạt Combo 3! Unlock Cướp điểm!`, 'achievement');
  }
  
  if (newStreak === 5) {
    updates[`players.${playerId}.badges`] = arrayUnion('combo_5');
    await triggerEvent(pin, `🔥 ${player.name} đạt Combo 5!`, 'achievement');
  }
  
  if (newStreak === 7) {
    updates[`players.${playerId}.badges`] = arrayUnion('combo_7');
    updates[`teams.${teamId}.fund`] = increment(5); // Bonus 5 điểm cho team
    await triggerEvent(pin, `⭐ ${player.name} đạt Combo 7! Team +5 điểm bonus!`, 'achievement');
  }
  
  if (newStreak === 10) {
    updates[`players.${playerId}.badges`] = arrayUnion('combo_10');
    await triggerEvent(pin, `👑 ${player.name} là HUYỀN THOẠI!`, 'achievement');
  }
  
  // Update team mission progress
  const missions = Object.values(roomData.teamMissions || {}).filter(
    (m: any) => m.teamId === teamId && m.status === 'active'
  );
  
  for (const mission of missions) {
    const newProgress = mission.progress + 1;
    
    if (newProgress >= mission.target) {
      updates[`teamMissions.${mission.id}.status`] = 'completed';
      updates[`teamMissions.${mission.id}.progress`] = newProgress;
      updates[`teams.${teamId}.fund`] = increment(mission.reward);
      await triggerEvent(pin, `✅ Mission hoàn thành! ${team.name} +${mission.reward} điểm!`, 'mission');
    } else {
      updates[`teamMissions.${mission.id}.progress`] = newProgress;
    }
  }
  
  await updateDoc(roomRef, updates);
  
  return points;
}

export async function resetStreak(pin: string, playerId: string) {
  const roomRef = doc(db, 'rooms', pin);
  await updateDoc(roomRef, {
    [`players.${playerId}.streak`]: 0,
    [`players.${playerId}.canSteal`]: false
  });
}

export async function createDuelChallenge(pin: string, player1Id: string, player2Id: string, questionId: string): Promise<string> {
  const roomRef = doc(db, 'rooms', pin);
  const duelId = `duel_${Date.now()}`;
  
  const duel: DuelChallenge = {
    id: duelId,
    player1Id,
    player2Id,
    questionId,
    player1Answer: null,
    player2Answer: null,
    winnerId: null,
    timestamp: Date.now(),
    status: 'waiting'
  };
  
  await updateDoc(roomRef, {
    [`currentDuels.${duelId}`]: duel
  });
  
  return duelId;
}

// Trigger random duel between 2 players from different teams
export async function triggerRandomDuel(pin: string): Promise<{ player1: Player; player2: Player; questionId: string } | null> {
  const roomRef = doc(db, 'rooms', pin);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) return null;
  
  const roomData = roomSnap.data() as GameRoom;
  const players = Object.values(roomData.players || {});
  const teams = Object.values(roomData.teams || {});
  
  if (teams.length < 2) return null; // Need at least 2 teams
  
  // Get 2 random different teams
  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
  const team1 = shuffledTeams[0];
  const team2 = shuffledTeams[1];
  
  // Get random player from each team
  const team1Players = players.filter(p => p.teamId === team1.id);
  const team2Players = players.filter(p => p.teamId === team2.id);
  
  if (team1Players.length === 0 || team2Players.length === 0) return null;
  
  const player1 = team1Players[Math.floor(Math.random() * team1Players.length)];
  const player2 = team2Players[Math.floor(Math.random() * team2Players.length)];
  
  // Get random question
  const questionId = `q${Math.floor(Math.random() * 50) + 1}`;
  
  // Create duel
  await createDuelChallenge(pin, player1.id, player2.id, questionId);
  
  return { player1, player2, questionId };
}

export async function answerDuel(pin: string, duelId: string, playerId: string, answer: number, correctAnswer: number) {
  const roomRef = doc(db, 'rooms', pin);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) return;
  
  const roomData = roomSnap.data() as GameRoom;
  const duel = roomData.currentDuels?.[duelId];
  
  if (!duel) return;
  
  const isPlayer1 = duel.player1Id === playerId;
  const updateKey = isPlayer1 ? 'player1Answer' : 'player2Answer';
  
  await updateDoc(roomRef, {
    [`currentDuels.${duelId}.${updateKey}`]: answer
  });
  
  // Check if both answered
  const updatedDuel = {
    ...duel,
    [updateKey]: answer
  };
  
  if (updatedDuel.player1Answer !== null && updatedDuel.player2Answer !== null) {
    // Determine winner
    const p1Correct = updatedDuel.player1Answer === correctAnswer;
    const p2Correct = updatedDuel.player2Answer === correctAnswer;
    
    let winnerId = null;
    if (p1Correct && !p2Correct) winnerId = duel.player1Id;
    else if (p2Correct && !p1Correct) winnerId = duel.player2Id;
    // If both correct or both wrong, it's a draw (winnerId stays null)
    
    await updateDoc(roomRef, {
      [`currentDuels.${duelId}.winnerId`]: winnerId,
      [`currentDuels.${duelId}.status`]: 'completed'
    });
    
    // Award point to winner's team
    if (winnerId) {
      const winner = roomData.players[winnerId];
      if (winner.teamId) {
        await updateDoc(roomRef, {
          [`teams.${winner.teamId}.fund`]: increment(1),
          [`players.${winnerId}.score`]: increment(1)
        });
      }
    }
  }
}

// New game mechanics

export async function stealPoints(pin: string, stealerId: string, targetTeamId: string, stealerTeamId: string) {
  const roomRef = doc(db, 'rooms', pin);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) return;
  
  const roomData = roomSnap.data() as GameRoom;
  const stealer = roomData.players[stealerId];
  const targetTeam = roomData.teams[targetTeamId];
  const stealerTeam = roomData.teams[stealerTeamId];
  
  await updateDoc(roomRef, {
    [`teams.${targetTeamId}.fund`]: increment(-5),
    [`teams.${stealerTeamId}.fund`]: increment(5),
    [`players.${stealerId}.canSteal`]: false,
    [`players.${stealerId}.lastStealTime`]: Date.now()
  });
  
  await triggerEvent(pin, `⚔️ ${stealer.name} (${stealerTeam.name}) cướp 5 điểm từ ${targetTeam.name}!`, 'steal');
}

export async function sendReaction(pin: string, playerId: string, playerName: string, emoji: string) {
  await triggerEvent(pin, `${emoji} ${playerName}`, 'reaction');
}

export async function triggerRandomEvent(pin: string) {
  const roomRef = doc(db, 'rooms', pin);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) return;
  
  const roomData = roomSnap.data() as GameRoom;
  const teams = Object.values(roomData.teams);
  
  const events = [
    // Positive
    {
      type: 'positive',
      message: '📢 Phong trào lan rộng! Tất cả teams +5 điểm',
      action: async () => {
        const updates: any = {};
        for (const team of teams) {
          updates[`teams.${team.id}.fund`] = increment(5);
        }
        await updateDoc(roomRef, updates);
      }
    },
    {
      type: 'positive',
      message: '🔥 Thời điểm vàng! Điểm x2 trong 20 giây',
      action: async () => {
        await updateDoc(roomRef, { doublePointsUntil: Date.now() + 20000 });
      }
    },
    // Challenge
    {
      type: 'challenge',
      message: '⚔️ Thách đấu cấp tốc!',
      action: async () => {
        await triggerRandomDuel(pin);
      }
    },
    {
      type: 'challenge',
      message: '🎯 Ai nhanh hơn? Người đầu tiên trả lời đúng +10 điểm',
      action: async () => {
        await updateDoc(roomRef, { firstCorrectBonus: 10 });
      }
    },
    // Chaos
    {
      type: 'chaos',
      message: '🎰 May rủi! Mỗi team nhận điểm ngẫu nhiên',
      action: async () => {
        const updates: any = {};
        for (const team of teams) {
          const random = [-5, 0, 5, 10][Math.floor(Math.random() * 4)];
          updates[`teams.${team.id}.fund`] = increment(random);
        }
        await updateDoc(roomRef, updates);
      }
    }
  ];
  
  const event = events[Math.floor(Math.random() * events.length)];
  await event.action();
  await triggerEvent(pin, event.message, event.type);
}

export async function startTeamMission(pin: string, teamId: string) {
  const roomRef = doc(db, 'rooms', pin);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) return;
  
  const roomData = roomSnap.data() as GameRoom;
  const team = roomData.teams[teamId];
  const missionId = `mission_${teamId}_${Date.now()}`;
  
  const mission: TeamMission = {
    id: missionId,
    teamId,
    title: 'Tổ chức mít tinh 1/5',
    description: 'Cả team trả lời đúng 5 câu trong 60 giây',
    target: 5,
    progress: 0,
    timeLimit: 60,
    startTime: Date.now(),
    reward: 20,
    status: 'active'
  };
  
  await updateDoc(roomRef, {
    [`teamMissions.${missionId}`]: mission
  });
  
  await triggerEvent(pin, `🎯 TEAM MISSION! ${team.name} - ${mission.description}`, 'mission');
  
  // Auto-fail after time limit
  setTimeout(async () => {
    const snap = await getDoc(roomRef);
    if (!snap.exists()) return;
    
    const data = snap.data() as GameRoom;
    const m = data.teamMissions?.[missionId];
    
    if (m && m.status === 'active') {
      await updateDoc(roomRef, {
        [`teamMissions.${missionId}.status`]: 'failed'
      });
      await triggerEvent(pin, `❌ Mission thất bại: ${team.name}`, 'mission');
    }
  }, 60000);
}

export async function triggerEvent(pin: string, message: string, type?: string) {
  const roomRef = doc(db, 'rooms', pin);
  await updateDoc(roomRef, {
    events: arrayUnion({ message, timestamp: Date.now(), type })
  });
}
