import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, useGameRoom, startGame, triggerRandomDuel, triggerEvent, triggerRandomEvent, startTeamMission } from '../hooks/useGame';
import { motion } from 'framer-motion';

function Timer({ endTime }: { endTime: number }) {
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
  const isUrgent = timeLeft < 60000; // Less than 1 minute

  return (
    <div className={`text-center ${isUrgent ? 'animate-pulse' : ''}`}>
      <div className="typewriter-text text-sm uppercase tracking-widest mb-2 opacity-70">Thời gian còn lại</div>
      <div className={`text-7xl font-black font-mono ${isUrgent ? 'text-[#8b1a1a]' : 'text-[#2b2824]'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}

export default function HostView() {
  const [pin, setPin] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'thienan') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Sai tài khoản hoặc mật khẩu!');
      setPassword('');
    }
  };

  const handleCreateRoom = async () => {
    const newPin = await createRoom();
    setPin(newPin);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center selection:bg-[#2b2824] selection:text-[#e6dfcc] relative overflow-hidden p-4">
        {/* Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="absolute top-4 left-4 px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#2b2824] bg-[#f4ebd8] border-2 border-[#2b2824] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[4px_4px_0px_rgba(43,40,36,0.5)] z-10"
          title="Trở về trang chủ"
        >
          <span className="typewriter-text">← Trang Chủ</span>
        </button>

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">✦</div>
          <div className="absolute bottom-10 right-10 text-9xl">✦</div>
          <div className="absolute top-1/2 left-1/4 text-6xl">❦</div>
          <div className="absolute top-1/3 right-1/4 text-6xl">❦</div>
        </div>

        <form onSubmit={handleLogin} className="bg-[#f4ebd8] p-8 md:p-12 border-4 border-[#2b2824] shadow-[12px_12px_0px_0px_rgba(43,40,36,1)] max-w-md w-full relative z-10">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#8b1a1a] border-2 border-[#2b2824]"></div>
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#8b1a1a] border-2 border-[#2b2824]"></div>
          <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-[#8b1a1a] border-2 border-[#2b2824]"></div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#8b1a1a] border-2 border-[#2b2824]"></div>
          
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="newspaper-title text-4xl font-black uppercase tracking-tighter mb-2 border-b-4 border-double border-[#2b2824] pb-4">
              Xác Thực<br/>Host
            </h1>
            <p className="text-sm typewriter-text opacity-70 mt-2">Chỉ dành cho Ban Tổ Chức</p>
          </div>
          
          {authError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#8b1a1a] text-[#f5ede0] p-3 mb-6 font-bold text-sm typewriter-text text-center border-2 border-[#2b2824]"
            >
              ⚠️ {authError}
            </motion.div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-2 typewriter-text">
                👤 Tài khoản
              </label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nhập tài khoản"
                className="w-full bg-transparent border-b-4 border-[#2b2824] focus:outline-none focus:border-[#8b1a1a] py-3 text-xl font-bold font-serif transition-colors"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-2 typewriter-text">
                🔑 Mật khẩu
              </label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full bg-transparent border-b-4 border-[#2b2824] focus:outline-none focus:border-[#8b1a1a] py-3 text-xl font-bold font-mono tracking-widest transition-colors"
                required
                autoComplete="current-password"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full group relative inline-flex items-center justify-center px-8 py-5 text-xl font-bold uppercase tracking-widest text-[#f5ede0] bg-[#8b1a1a] border-4 border-[#2b2824] overflow-hidden transition-all hover:scale-105 active:scale-95 mt-8 cursor-pointer shadow-[6px_6px_0px_rgba(43,40,36,1)]"
            >
              <span className="relative typewriter-text flex items-center gap-2">
                <span>Đăng Nhập</span>
                <span className="text-2xl">→</span>
              </span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs typewriter-text opacity-50">
            Liên hệ Ban Tổ Chức để lấy thông tin đăng nhập
          </div>
        </form>
      </div>
    );
  }

  if (!pin) {
    return (
      <div className="min-h-screen flex items-center justify-center selection:bg-[#2b2824] selection:text-[#e6dfcc] relative">
        {/* Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="absolute top-4 left-4 px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#2b2824] bg-[#f4ebd8] border-2 border-[#2b2824] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[4px_4px_0px_rgba(43,40,36,0.5)]"
          title="Trở về trang chủ"
        >
          <span className="typewriter-text">← Trang Chủ</span>
        </button>
        
        <div className="text-center bg-[#f4ebd8] p-12 border-4 border-double border-[#2b2824] shadow-[16px_16px_0px_0px_rgba(43,40,36,0.8)] max-w-2xl w-full mx-4">
          <h1 className="newspaper-title text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 border-b-4 border-[#2b2824] pb-6">
            Đài Phát Thanh<br/>Trung Ương
          </h1>
          <p className="newspaper-text text-xl mb-12 italic">
            "Đồng chí hãy thiết lập đường dây liên lạc để tập hợp lực lượng quần chúng."
          </p>
          <button 
            onClick={handleCreateRoom}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold uppercase tracking-widest text-[#e6dfcc] bg-[#2b2824] overflow-hidden transition-all hover:scale-105 active:scale-95 w-full cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative typewriter-text ">Tạo Phong Trào Mới</span>
          </button>
        </div>
      </div>
    );
  }

  return <HostDashboard pin={pin} />;
}

function HostDashboard({ pin }: { pin: string }) {
  const { room, loading } = useGameRoom(pin);
  const [duelCooldown, setDuelCooldown] = useState(false);
  const [missionTriggered, setMissionTriggered] = useState(false);

  const handleTriggerDuel = async () => {
    if (duelCooldown) return;
    
    setDuelCooldown(true);
    const result = await triggerRandomDuel(pin);
    
    if (result) {
      await triggerEvent(pin, `⚔️ THÁCH ĐẤU: ${result.player1.name} vs ${result.player2.name}!`, 'duel');
    }
    
    // 10 second cooldown
    setTimeout(() => setDuelCooldown(false), 10000);
  };

  // Trigger random events every 90 seconds
  useEffect(() => {
    if (room?.status !== 'playing') return;
    
    const interval = setInterval(() => {
      triggerRandomEvent(pin);
    }, 90000);
    
    // First event after 60 seconds
    const firstTimeout = setTimeout(() => {
      triggerRandomEvent(pin);
    }, 60000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, [room?.status, pin]);

  // Trigger team mission at 2.5 minutes
  useEffect(() => {
    if (room?.status !== 'playing' || !room.startTime || missionTriggered) return;
    
    const checkMission = setInterval(() => {
      const elapsed = Date.now() - (room.startTime || 0);
      const triggerTime = 2.5 * 60 * 1000; // 2.5 minutes
      
      if (elapsed >= triggerTime && !missionTriggered) {
        setMissionTriggered(true);
        // Trigger mission for all teams
        Object.keys(room.teams).forEach(teamId => {
          startTeamMission(pin, teamId);
        });
      }
    }, 1000);
    
    return () => clearInterval(checkMission);
  }, [room?.status, room?.startTime, room?.teams, pin, missionTriggered]);

  if (loading || !room) return <div className="min-h-screen flex items-center justify-center typewriter-text text-2xl animate-pulse">Đang kết nối đường dây...</div>;

  const players = Object.values(room.players || {});
  const teams = Object.values(room.teams || {});
  
  // Sort teams by fund (descending) for ranking
  const rankedTeams = [...teams].sort((a, b) => b.fund - a.fund);
  
  const targetFund = 100; // Win condition - reduced from 1000
  
  // Check if time is up
  const timeIsUp = room.endTime ? Date.now() >= room.endTime : false;
  
  // Game ends if time is up OR any team reaches target
  const gameEnded = timeIsUp || (rankedTeams.length > 0 && rankedTeams[0].fund >= targetFund);

  return (
    <div className="min-h-screen p-4 md:p-8 selection:bg-[#2b2824] selection:text-[#e6dfcc] relative">
      {/* Flying Reactions */}
      {room.events
        .filter(e => e.type === 'reaction')
        .slice(-10)
        .map((e, i) => (
          <motion.div
            key={`${e.timestamp}-${i}`}
            initial={{ y: 0, opacity: 1, x: Math.random() * window.innerWidth }}
            animate={{ y: -300, opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="fixed bottom-20 text-6xl pointer-events-none z-40"
            style={{ left: `${Math.random() * 80 + 10}%` }}
          >
            {e.message}
          </motion.div>
        ))
      }
      
      {room.status === 'waiting' ? (
        <div className="max-w-5xl mx-auto text-center">
          {/* Home Button */}
          <button
            onClick={() => window.location.href = '/'}
            className="absolute top-4 left-4 px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#2b2824] bg-[#f4ebd8] border-2 border-[#2b2824] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[4px_4px_0px_rgba(43,40,36,0.5)]"
            title="Trở về trang chủ"
          >
            <span className="typewriter-text">← Trang Chủ</span>
          </button>
          
          <div className="bg-[#f4ebd8] p-8 md:p-16 border-4 border-double border-[#2b2824] shadow-[16px_16px_0px_0px_rgba(43,40,36,0.8)] mb-12">
            <h2 className="typewriter-text text-2xl font-bold uppercase tracking-widest mb-6 border-b-2 border-dashed border-[#2b2824] inline-block pb-2">Mã Mật Khẩu (PIN)</h2>
            <div className="text-8xl md:text-9xl font-black tracking-widest text-[#2b2824] py-8 mb-8 font-mono border-y-8 border-double border-[#2b2824] bg-[#e6dfcc]">
              {pin}
            </div>
            <p className="newspaper-text text-xl italic">Yêu cầu các đồng chí nhập mã này để gia nhập phong trào.</p>
          </div>
          
          <div className="mb-12">
            <h3 className="newspaper-title text-3xl font-bold mb-6 border-b-2 border-[#2b2824] pb-2 text-left">Lực Lượng Đã Tập Hợp ({players.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {players.map(p => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 10 - 5 }}
                  animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
                  className="bg-[#f4ebd8] p-4 border-2 border-[#2b2824] shadow-[4px_4px_0px_0px_rgba(43,40,36,1)] font-bold typewriter-text text-sm flex flex-col items-center justify-center"
                >
                  <span className="text-lg">{p.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => startGame(pin)}
            disabled={players.length === 0}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold uppercase tracking-widest text-[#e6dfcc] bg-[#8b0000] overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative typewriter-text">Bắt Đầu Cuộc Mít Tinh</span>
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-8 border-double border-[#2b2824] pb-6 gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#2b2824] bg-[#f4ebd8] border-2 border-[#2b2824] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Trở về trang chủ"
              >
                <span className="typewriter-text">← Trang Chủ</span>
              </button>
              
              <h1 className="newspaper-title text-4xl md:text-5xl font-black uppercase tracking-tighter text-center md:text-left">
                Khu Đấu Xảo Hà Nội<br/><span className="text-2xl">1/5/1938</span>
              </h1>
            </div>
            
            {/* Timer */}
            {room.endTime && (
              <div className="bg-[#f4ebd8] border-4 border-[#2b2824] p-6 shadow-[8px_8px_0px_rgba(43,40,36,0.5)]">
                <Timer endTime={room.endTime} />
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              {/* Duel Trigger Button */}
              <button
                onClick={handleTriggerDuel}
                disabled={duelCooldown || gameEnded}
                className="group relative inline-flex items-center justify-center px-6 py-3 text-lg font-bold uppercase tracking-widest text-[#e6dfcc] bg-[#8b1a1a] overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer border-2 border-[#2b2824]"
              >
                <span className="relative typewriter-text">
                  {duelCooldown ? '⏳ Chờ 10s...' : '⚔️ Tạo Thách Đấu'}
                </span>
              </button>
              
              <div className="bg-[#2b2824] text-[#e6dfcc] px-6 py-3 border-4 border-double border-[#e6dfcc] outline outline-4 outline-[#2b2824]">
                <div className="text-sm typewriter-text opacity-80 mb-1">Mã PIN</div>
                <div className="text-3xl font-black tracking-widest font-mono">{pin}</div>
              </div>
            </div>
          </header>

          {/* Leaderboard */}
          <div className="mb-16 bg-[#f4ebd8] p-8 border-4 border-[#2b2824] shadow-[12px_12px_0px_0px_rgba(43,40,36,1)]">
            <h2 className="newspaper-title text-4xl font-black uppercase mb-8 text-center border-b-4 border-double border-[#2b2824] pb-4 text-[#8b1a1a]">
              🏆 BẢNG XẾP HẠNG 🏆
            </h2>
            <div className="space-y-4">
              {rankedTeams.map((team, index) => {
                const progress = Math.min((team.fund / targetFund) * 100, 100);
                const medals = ['🥇', '🥈', '🥉'];
                const colors = ['bg-[#ffd700]', 'bg-[#c0c0c0]', 'bg-[#cd7f32]'];
                
                return (
                  <motion.div 
                    key={team.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-4 border-[#2b2824] p-6 ${index < 3 ? colors[index] : 'bg-[#e8dfc7]'} shadow-[6px_6px_0px_rgba(26,23,20,0.5)]`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{index < 3 ? medals[index] : `#${index + 1}`}</span>
                        <div>
                          <h3 className="newspaper-title text-3xl font-black uppercase">{team.name}</h3>
                          <div className="text-sm typewriter-text opacity-70">{team.members.length} thành viên</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-black font-mono text-[#8b1a1a]">{team.fund}</div>
                        <div className="text-sm typewriter-text opacity-70">/ {targetFund} điểm</div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-8 bg-[#e6dfcc] border-2 border-[#2b2824] relative overflow-hidden">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-[#8b1a1a]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-lg mix-blend-difference text-white font-mono">
                        {Math.floor(progress)}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Check if any team won or time is up */}
          {gameEnded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 perspective-[1000px]"
            >
              <div className="bg-[#e6dfcc] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] p-12 max-w-3xl text-center border-8 border-double border-[#2b2824] shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                <div className="typewriter-text text-xl font-bold tracking-widest mb-4 border-b-2 border-dashed border-[#2b2824] inline-block pb-2">
                  {timeIsUp ? 'HẾT GIỜ!' : 'TIN ĐẶC BIỆT'}
                </div>
                {rankedTeams.length > 0 ? (
                  <>
                    <h2 className="newspaper-title text-6xl md:text-7xl font-black uppercase text-[#8b1a1a] mb-8 leading-none">
                      🥇 {rankedTeams[0].name} THẮNG LỢI!
                    </h2>
                    <p className="newspaper-text text-2xl font-bold mb-6 leading-relaxed">
                      {rankedTeams[0].name} đã hoàn thành xuất sắc nhiệm vụ với <span className="text-[#8b1a1a] text-4xl font-black">{rankedTeams[0].fund}</span> điểm!
                    </p>
                    
                    {/* Top 3 */}
                    <div className="mb-8 bg-[#f4ebd8] p-6 border-4 border-[#2b2824]">
                      <h3 className="newspaper-title text-2xl font-bold mb-4 uppercase">Bảng Xếp Hạng</h3>
                      {rankedTeams.slice(0, 3).map((team, idx) => (
                        <div key={team.id} className="flex justify-between items-center py-2 border-b-2 border-dashed border-[#2b2824] last:border-0">
                          <span className="text-3xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                          <span className="font-bold text-xl">{team.name}</span>
                          <span className="font-mono font-black text-2xl">{team.fund}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <h2 className="newspaper-title text-5xl font-black uppercase text-[#8b1a1a] mb-8">
                    GAME KẾT THÚC!
                  </h2>
                )}
                
                <p className="newspaper-text text-lg mb-8 italic">
                  Sức mạnh đoàn kết của nhân dân Đông Dương đã làm rung chuyển chính quyền thực dân!
                </p>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold uppercase tracking-widest text-[#e6dfcc] bg-[#2b2824] overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                  <span className="relative typewriter-text">Trở Về Trang Chủ</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Teams Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teams.map(team => {
              const teamPlayers = team.members.map(memberId => room.players[memberId]).filter(Boolean);
              
              return (
                <div key={team.id} className="bg-[#f4ebd8] border-4 border-[#2b2824] p-6 shadow-[8px_8px_0px_0px_rgba(43,40,36,1)] relative">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#8b1a1a] text-[#f5ede0] flex items-center justify-center text-2xl font-black border-2 border-[#2b2824]">
                    {rankedTeams.findIndex(t => t.id === team.id) + 1}
                  </div>
                  
                  <h3 className="newspaper-title text-2xl font-black uppercase border-b-4 border-double border-[#2b2824] pb-3 mb-4 text-center mt-4">{team.name}</h3>
                  
                  <div className="text-center mb-4 bg-[#2b2824] text-[#e6dfcc] py-3 px-4">
                    <div className="text-sm typewriter-text opacity-80">Quỹ nhóm</div>
                    <div className="text-4xl font-black font-mono">{team.fund}</div>
                  </div>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {teamPlayers.length === 0 ? (
                      <div className="text-center italic opacity-50 typewriter-text text-sm">Chưa có thành viên</div>
                    ) : (
                      teamPlayers.map(p => (
                        <div key={p.id} className="border-2 border-[#2b2824] p-3 bg-[#e8dfc7]">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-bold text-lg mb-1">{p.name}</div>
                              <div className="text-xs typewriter-text uppercase opacity-70 flex items-center gap-1">
                                <span>
                                  {p.role === 'Nhà báo' ? '📰' : p.role === 'Công nhân' ? '⚒️' : p.role === 'Nông dân' ? '🌾' : '💰'}
                                </span>
                                {p.role}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-black bg-[#2b2824] text-[#e6dfcc] px-2 py-1 text-lg">
                                {p.score || 0}
                              </div>
                              <div className="text-xs opacity-70 mt-1">điểm</div>
                            </div>
                          </div>
                          
                          {/* Streak and Badges */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#2b2824]/30">
                            <div className="flex items-center gap-1">
                              {p.streak > 0 && (
                                <span className="text-sm font-bold text-[#8b1a1a]">
                                  🔥 {p.streak}
                                </span>
                              )}
                              {p.badges && p.badges.length > 0 && (
                                <div className="flex gap-1">
                                  {p.badges.includes('combo_3') && <span title="Combo 3">🎖️</span>}
                                  {p.badges.includes('combo_5') && <span title="Combo 5">🔥</span>}
                                  {p.badges.includes('combo_7') && <span title="Combo 7">⭐</span>}
                                  {p.badges.includes('combo_10') && <span title="Combo 10">👑</span>}
                                </div>
                              )}
                            </div>
                            {p.canSteal && (
                              <span className="text-xs bg-[#8b1a1a] text-white px-2 py-1 rounded">
                                ⚔️ Có thể cướp
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
