import { useState, useEffect } from 'react';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameRoom, Player, stealPoints, sendReaction } from '../hooks/useGame';
import QuizChallenge from './QuizChallenge';
import DuelChallenge from './DuelChallenge';
import RandomEvent from './RandomEvent';

function MiniTimer({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTime]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isUrgent = timeLeft < 60000;

  return (
    <div className={`text-center ${isUrgent ? 'animate-pulse' : ''}`}>
      <div className="typewriter-text text-xs uppercase tracking-widest opacity-70">Thời gian</div>
      <div className={`text-3xl font-black font-mono ${isUrgent ? 'text-[#8b1a1a]' : 'text-[#2b2824]'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}

export default function PlayerDashboard({ pin, playerId, initialPlayer }: { pin: string, playerId: string, initialPlayer: Player }) {
  const { room, loading } = useGameRoom(pin);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCooldown, setQuizCooldown] = useState(0);
  const [showStealModal, setShowStealModal] = useState(false);
  const [selectedTargetTeam, setSelectedTargetTeam] = useState<string | null>(null);
  const [showMilestone, setShowMilestone] = useState<string | null>(null);
  const prevStreak = React.useRef(0);

  useEffect(() => {
    if (quizCooldown > 0) {
      const timer = setTimeout(() => setQuizCooldown(quizCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [quizCooldown]);

  // Show milestone animation - MUST be after all useState/useRef
  React.useEffect(() => {
    if (!room) return;
    const me = room.players[playerId] || initialPlayer;
    
    if (me.streak !== prevStreak.current) {
      if (me.streak === 3 || me.streak === 5 || me.streak === 7 || me.streak === 10) {
        const icon = me.streak === 3 ? '🎖️' : me.streak === 5 ? '🔥' : me.streak === 7 ? '⭐' : '👑';
        setShowMilestone(icon);
        setTimeout(() => setShowMilestone(null), 2000);
      }
      prevStreak.current = me.streak;
    }
  }, [room, playerId, initialPlayer]);

  if (loading || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📡</div>
          <div className="typewriter-text text-2xl animate-pulse">Đang kết nối đường dây...</div>
        </div>
      </div>
    );
  }

  const me = room.players[playerId] || initialPlayer;
  const myTeam = me.teamId ? room.teams[me.teamId] : null;
  
  const rankedTeams = Object.values(room.teams).sort((a, b) => b.fund - a.fund);
  const myTeamRank = myTeam ? rankedTeams.findIndex(t => t.id === myTeam.id) + 1 : 0;

  const myDuel = room.currentDuels ? Object.values(room.currentDuels).find(
    d => (d.player1Id === playerId || d.player2Id === playerId) && d.status !== 'completed'
  ) : null;

  const myMission = room.teamMissions 
    ? Object.values(room.teamMissions).find(
        (m: any) => m.teamId === myTeam?.id && m.status === 'active'
      )
    : null;

  // Check if game ended
  const timeIsUp = room.endTime ? Date.now() >= room.endTime : false;
  const targetFund = 100;
  const gameEnded = timeIsUp || (rankedTeams.length > 0 && rankedTeams[0].fund >= targetFund);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setQuizCooldown(3);
  };

  const handleSteal = async () => {
    if (!selectedTargetTeam || !myTeam) return;
    
    await stealPoints(pin, playerId, selectedTargetTeam, myTeam.id);
    setShowStealModal(false);
    setSelectedTargetTeam(null);
  };

  const reactions = [
    { emoji: '😂', label: 'Cười' },
    { emoji: '😱', label: 'Sợ' },
    { emoji: '🔥', label: 'Hype' },
    { emoji: '💪', label: 'Tự tin' }
  ];

  const handleReaction = async (emoji: string) => {
    await sendReaction(pin, playerId, me.name, emoji);
  };

  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative">
        {/* Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="absolute top-4 left-4 px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#1a1714] bg-[#f4ebd8] border-2 border-[#1a1714] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[4px_4px_0px_rgba(26,23,20,0.5)]"
          title="Trở về trang chủ"
        >
          <span className="typewriter-text">← Trang Chủ</span>
        </button>
        
        <div className="text-7xl mb-6 animate-pulse">⏳</div>
        <h2 className="newspaper-title text-3xl font-bold uppercase mb-6">Đã gia nhập phong trào</h2>
        
        <div className="bg-[#f4ebd8] p-10 border-4 border-double border-[#1a1714] shadow-[12px_12px_0px_0px_rgba(26,23,20,1)] mb-12 relative max-w-md">
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#8b1a1a] text-[#f5ede0] flex items-center justify-center text-2xl font-black border-2 border-[#1a1714]">
            ✓
          </div>
          
          <div className="typewriter-text text-sm font-bold tracking-widest uppercase mb-4 opacity-70 border-b border-[#1a1714] pb-2">
            Bí danh của đồng chí
          </div>
          <div className="newspaper-title text-5xl font-black uppercase text-[#8b1a1a] mb-4">
            {me.name}
          </div>
          <div className="text-sm opacity-70">
            Vai trò và nhóm sẽ được phân công khi bắt đầu
          </div>
        </div>
        
        <p className="newspaper-text text-2xl italic animate-pulse mb-4">
          Chờ lệnh từ Đài Phát Thanh Trung Ương...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 pb-24">
      {/* Random Events Display */}
      <RandomEvent events={room.events || []} />
      
      {/* Home Button - Fixed position */}
      <button
        onClick={() => window.location.href = '/'}
        className="fixed top-4 left-4 z-40 px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#1a1714] bg-[#f4ebd8] border-2 border-[#1a1714] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[4px_4px_0px_rgba(26,23,20,0.5)]"
        title="Trở về trang chủ"
      >
        <span className="typewriter-text">← Trang Chủ</span>
      </button>
      
      {/* Milestone Animation */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.5, 1], rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="text-9xl drop-shadow-2xl">{showMilestone}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-md mx-auto">
        {/* Team Mission */}
        {myMission && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#8b1a1a] text-[#f5ede0] p-4 border-4 border-[#1a1714] mb-4 shadow-[8px_8px_0px_rgba(26,23,20,0.5)]"
          >
            <div className="text-sm font-bold typewriter-text">🎯 TEAM MISSION</div>
            <div className="text-lg font-black newspaper-title">{myMission.title}</div>
            <div className="text-sm mb-2">{myMission.description}</div>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Tiến độ: {myMission.progress}/{myMission.target}</span>
                <span>⏱️ {Math.max(0, Math.floor((myMission.startTime + myMission.timeLimit * 1000 - Date.now()) / 1000))}s</span>
              </div>
              <div className="h-2 bg-white/30 border border-[#1a1714]">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${(myMission.progress / myMission.target) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-6 space-y-4">
          {room.endTime && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#f4ebd8] border-4 border-[#1a1714] p-4 shadow-[6px_6px_0px_rgba(26,23,20,0.5)]"
            >
              <MiniTimer endTime={room.endTime} />
            </motion.div>
          )}
          
          {myTeam && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1714] text-[#f5ede0] p-4 border-4 border-[#8b1a1a] shadow-[6px_6px_0px_rgba(139,26,26,0.5)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center border-r-2 border-[#8b1a1a] pr-4">
                  <div className="text-xs typewriter-text uppercase tracking-widest opacity-80 mb-1">Xếp hạng</div>
                  <div className="text-5xl font-black">
                    {myTeamRank === 1 ? '🥇' : myTeamRank === 2 ? '🥈' : myTeamRank === 3 ? '🥉' : `#${myTeamRank}`}
                  </div>
                </div>
                <div className="flex-1 text-center pl-4">
                  <div className="text-xs typewriter-text uppercase tracking-widest opacity-80 mb-1">{myTeam.name}</div>
                  <div className="text-4xl font-black font-mono text-[#8b1a1a]">{myTeam.fund}</div>
                  <div className="text-xs opacity-70">/ 100 điểm</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#f4ebd8] p-6 border-4 border-[#1a1714] shadow-[12px_12px_0px_0px_rgba(26,23,20,1)] mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-[#1a1714] text-[#f5ede0] px-4 py-2 text-xs font-bold uppercase tracking-widest typewriter-text border-l-4 border-b-4 border-[#8b1a1a]">
            Thẻ Căn Cước
          </div>
          
          <div className="mt-8">
            <h2 className="newspaper-title text-3xl font-black uppercase mb-2">{me.name}</h2>
            <div className="text-xl font-bold text-[#8b1a1a] uppercase tracking-widest mb-4 typewriter-text flex items-center gap-2">
              <span className="text-2xl">
                {me.role === 'Nhà báo' ? '📰' : me.role === 'Công nhân' ? '⚒️' : me.role === 'Nông dân' ? '🌾' : '💰'}
              </span>
              {me.role}
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t-4 border-double border-[#1a1714] pt-4 mb-4">
              <div className="text-center border-r-2 border-dashed border-[#1a1714]">
                <div className="typewriter-text text-xs font-bold uppercase opacity-70 mb-1">Điểm cá nhân</div>
                <div className="text-4xl font-black font-mono">{me.score || 0}</div>
              </div>
              <div className="text-center">
                <div className="typewriter-text text-xs font-bold uppercase opacity-70 mb-1">Combo 🔥</div>
                <div className="text-4xl font-black font-mono text-[#8b1a1a]">{me.streak || 0}</div>
              </div>
            </div>

            {/* Badges */}
            {me.badges && me.badges.length > 0 && (
              <div className="flex gap-2 justify-center flex-wrap border-t-2 border-dashed border-[#1a1714] pt-3">
                {me.badges.includes('combo_3') && <span className="text-3xl" title="Combo 3">🎖️</span>}
                {me.badges.includes('combo_5') && <span className="text-3xl" title="Combo 5">🔥</span>}
                {me.badges.includes('combo_7') && <span className="text-3xl" title="Combo 7">⭐</span>}
                {me.badges.includes('combo_10') && <span className="text-3xl" title="Combo 10">👑</span>}
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-4 mb-6">
          {/* Quiz Button */}
          <button 
            onClick={handleStartQuiz}
            disabled={quizCooldown > 0}
            className="w-full group relative inline-flex items-center justify-center px-8 py-6 text-xl font-bold uppercase tracking-widest text-[#f5ede0] bg-[#8b1a1a] border-4 border-[#1a1714] overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[8px_8px_0px_0px_rgba(26,23,20,0.5)] cursor-pointer"
          >
            <span className="relative typewriter-text flex items-center gap-3">
              <span className="text-3xl">📝</span>
              {quizCooldown > 0 ? `Chờ ${quizCooldown}s...` : 'Trả lời Câu Hỏi'}
              <span className="text-3xl">📝</span>
            </span>
          </button>

          {/* Steal Button */}
          {me.canSteal && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setShowStealModal(true)}
              className="w-full px-8 py-5 text-lg font-bold uppercase tracking-widest bg-[#8b1a1a] text-[#f5ede0] border-4 border-[#1a1714] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[6px_6px_0px_rgba(26,23,20,0.5)]"
            >
              <span className="typewriter-text flex items-center justify-center gap-2">
                <span className="text-2xl">⚔️</span>
                Cướp 5 Điểm
              </span>
            </motion.button>
          )}

          {/* Reactions */}
          <div className="flex gap-2 justify-center p-4 bg-[#f4ebd8] border-2 border-[#1a1714]">
            {reactions.map(r => (
              <button
                key={r.emoji}
                onClick={() => handleReaction(r.emoji)}
                disabled={quizCooldown === 0}
                className="text-4xl hover:scale-125 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Teammates List */}
        {myTeam && myTeam.members.length > 1 && (
          <div className="bg-[#f4ebd8] p-6 border-2 border-[#1a1714] mb-6">
            <h3 className="newspaper-title text-xl font-bold uppercase mb-4 border-b-2 border-[#1a1714] pb-2 flex items-center gap-2">
              <span>👥</span> Đồng đội ({myTeam.members.length - 1})
            </h3>
            <div className="space-y-2">
              {myTeam.members
                .map(id => room.players[id])
                .filter(p => p && p.id !== playerId)
                .map(p => (
                  <div key={p.id} className="border-2 border-[#1a1714] p-3 bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-lg">{p.name}</span>
                        <div className="text-xs typewriter-text uppercase opacity-70">
                          {p.role === 'Nhà báo' ? '📰' : p.role === 'Công nhân' ? '⚒️' : p.role === 'Nông dân' ? '🌾' : '💰'} {p.role}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-black text-xl">{p.score || 0}</div>
                        <div className="text-xs opacity-70">điểm</div>
                      </div>
                    </div>
                    {p.streak > 0 && (
                      <div className="mt-2 text-sm text-[#8b1a1a] font-bold">
                        🔥 Streak: {p.streak}
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Steal Modal */}
      <AnimatePresence>
        {showStealModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStealModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#f4ebd8] p-8 border-4 border-[#1a1714] max-w-md w-full shadow-[12px_12px_0px_rgba(26,23,20,1)]"
            >
              <h3 className="newspaper-title text-3xl font-black mb-6 text-center border-b-4 border-[#1a1714] pb-4">
                ⚔️ Chọn team để cướp
              </h3>
              <div className="space-y-2 mb-6">
                {rankedTeams
                  .filter(t => t.id !== myTeam?.id)
                  .map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTargetTeam(t.id)}
                      className={`w-full p-4 border-2 border-[#1a1714] font-bold text-lg transition-all ${
                        selectedTargetTeam === t.id 
                          ? 'bg-[#8b1a1a] text-[#f5ede0] scale-105' 
                          : 'bg-white hover:bg-[#e6dfcc]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{t.name}</span>
                        <span className="font-mono">{t.fund} điểm</span>
                      </div>
                    </button>
                  ))
                }
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSteal}
                  disabled={!selectedTargetTeam}
                  className="flex-1 bg-[#8b1a1a] text-[#f5ede0] p-4 font-bold uppercase border-2 border-[#1a1714] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                >
                  Xác nhận
                </button>
                <button 
                  onClick={() => setShowStealModal(false)}
                  className="flex-1 bg-[#2b2824] text-[#f5ede0] p-4 font-bold uppercase border-2 border-[#1a1714] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Challenge */}
      <AnimatePresence>
        {showQuiz && (
          <QuizChallenge
            pin={pin}
            playerId={playerId}
            teamId={myTeam?.id || ''}
            playerStreak={me.streak || 0}
            onComplete={handleQuizComplete}
          />
        )}
      </AnimatePresence>

      {/* Duel Challenge */}
      <AnimatePresence>
        {myDuel && (
          <DuelChallenge
            pin={pin}
            playerId={playerId}
            duel={myDuel}
            opponentName={room.players[myDuel.player1Id === playerId ? myDuel.player2Id : myDuel.player1Id]?.name || 'Đối thủ'}
            opponentTeam={room.teams[room.players[myDuel.player1Id === playerId ? myDuel.player2Id : myDuel.player1Id]?.teamId || '']?.name || 'Nhóm khác'}
            myTeam={myTeam?.name || 'Nhóm của bạn'}
            onComplete={() => {}}
          />
        )}
      </AnimatePresence>

      {/* Victory Screen */}
      <AnimatePresence>
        {gameEnded && rankedTeams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-[#f4ebd8] p-8 max-w-md w-full border-8 border-double border-[#1a1714] shadow-[0_0_50px_rgba(255,255,255,0.3)]">
              <div className="text-center">
                <div className="typewriter-text text-sm font-bold tracking-widest mb-4 border-b-2 border-dashed border-[#1a1714] inline-block pb-2">
                  {timeIsUp ? 'HẾT GIỜ!' : 'CHIẾN THẮNG!'}
                </div>
                
                <h2 className="newspaper-title text-5xl font-black uppercase text-[#8b1a1a] mb-6 leading-none">
                  {myTeamRank === 1 ? '🥇 THẮNG LỢI!' : myTeamRank === 2 ? '🥈 Á QUÂN' : myTeamRank === 3 ? '🥉 HẠN BA' : `#${myTeamRank}`}
                </h2>
                
                {myTeam && (
                  <div className="mb-6 bg-[#1a1714] text-[#f5ede0] p-6 border-4 border-[#8b1a1a]">
                    <div className="text-xl font-bold mb-2">{myTeam.name}</div>
                    <div className="text-5xl font-black font-mono text-[#8b1a1a]">{myTeam.fund}</div>
                    <div className="text-sm opacity-70">điểm</div>
                  </div>
                )}
                
                <div className="mb-6 bg-white/50 p-4 border-2 border-[#1a1714]">
                  <div className="text-sm font-bold mb-3 uppercase">Thành tích cá nhân</div>
                  <div className="flex justify-around">
                    <div>
                      <div className="text-2xl font-black">{me.score || 0}</div>
                      <div className="text-xs opacity-70">Điểm</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#8b1a1a]">{me.streak || 0}</div>
                      <div className="text-xs opacity-70">Combo cao nhất</div>
                    </div>
                  </div>
                  {me.badges && me.badges.length > 0 && (
                    <div className="flex gap-2 justify-center mt-3 pt-3 border-t border-[#1a1714]">
                      {me.badges.includes('combo_3') && <span className="text-2xl">🎖️</span>}
                      {me.badges.includes('combo_5') && <span className="text-2xl">🔥</span>}
                      {me.badges.includes('combo_7') && <span className="text-2xl">⭐</span>}
                      {me.badges.includes('combo_10') && <span className="text-2xl">👑</span>}
                    </div>
                  )}
                </div>
                
                <p className="newspaper-text text-sm mb-6 italic">
                  {myTeamRank === 1 
                    ? 'Xuất sắc! Đồng chí đã góp phần vào chiến thắng vẻ vang!' 
                    : 'Cảm ơn sự đóng góp của đồng chí cho phong trào!'}
                </p>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full px-8 py-4 text-lg font-bold uppercase tracking-widest text-[#f5ede0] bg-[#1a1714] border-4 border-[#8b1a1a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="typewriter-text">Trở Về Trang Chủ</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
