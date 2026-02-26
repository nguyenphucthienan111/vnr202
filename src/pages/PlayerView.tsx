import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { joinRoom, Player } from '../hooks/useGame';
import QuizChallenge from '../components/QuizChallenge';
import DuelChallenge from '../components/DuelChallenge';
import PlayerDashboard from '../components/PlayerDashboard';

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

export default function PlayerView() {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || !name) return;
    
    try {
      const newPlayer = await joinRoom(pin, name);
      if (newPlayer) {
        setPlayer(newPlayer);
      } else {
        setError('Không thể tham gia: Phòng không tồn tại hoặc trò chơi đã bắt đầu');
      }
    } catch (err) {
      setError('Lỗi kết nối đường dây');
    }
  };

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 selection:bg-[#1a1714] selection:text-[#e8dfc7] relative overflow-hidden">
        {/* Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="absolute top-4 left-4 z-20 px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#1a1714] bg-[#f4ebd8] border-2 border-[#1a1714] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[4px_4px_0px_rgba(26,23,20,0.5)]"
          title="Trở về trang chủ"
        >
          <span className="typewriter-text">← Trang Chủ</span>
        </button>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">✦</div>
          <div className="absolute bottom-10 right-10 text-9xl">✦</div>
          <div className="absolute top-1/2 left-1/4 text-6xl">❦</div>
          <div className="absolute top-1/3 right-1/4 text-6xl">❦</div>
        </div>

        <form onSubmit={handleJoin} className="bg-[#f4ebd8] p-8 md:p-12 border-4 border-[#1a1714] shadow-[12px_12px_0px_0px_rgba(26,23,20,1)] max-w-md w-full relative z-10">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#8b1a1a] border-2 border-[#1a1714]"></div>
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#8b1a1a] border-2 border-[#1a1714]"></div>
          <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-[#8b1a1a] border-2 border-[#1a1714]"></div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#8b1a1a] border-2 border-[#1a1714]"></div>
          
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚩</div>
            <h1 className="newspaper-title text-4xl font-black uppercase tracking-tighter mb-2 border-b-4 border-double border-[#1a1714] pb-4">
              Tham Gia<br/>Phong Trào
            </h1>
            <p className="text-sm typewriter-text opacity-70 mt-2">Đông Dương 1936-1939</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#8b1a1a] text-[#f5ede0] p-3 mb-6 font-bold text-sm typewriter-text text-center border-2 border-[#1a1714]"
            >
              ⚠️ {error}
            </motion.div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-2 typewriter-text">
                📝 Bí danh (Tên)
              </label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full bg-transparent border-b-4 border-[#1a1714] focus:outline-none focus:border-[#8b1a1a] py-3 text-xl font-bold font-serif transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-2 typewriter-text">
                🔑 Mã Mật Khẩu (PIN)
              </label>
              <input 
                type="text" 
                value={pin}
                onChange={e => setPin(e.target.value.toUpperCase())}
                placeholder="Nhập mã PIN"
                maxLength={4}
                className="w-full bg-transparent border-b-4 border-[#1a1714] focus:outline-none focus:border-[#8b1a1a] py-3 text-3xl font-bold font-mono tracking-widest text-center transition-colors"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full group relative inline-flex items-center justify-center px-8 py-5 text-xl font-bold uppercase tracking-widest text-[#f5ede0] bg-[#8b1a1a] border-4 border-[#1a1714] overflow-hidden transition-all hover:scale-105 active:scale-95 mt-8 cursor-pointer shadow-[6px_6px_0px_rgba(26,23,20,1)]"
            >
              <span className="relative typewriter-text flex items-center gap-2">
                <span>Gia Nhập</span>
                <span className="text-2xl">→</span>
              </span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs typewriter-text opacity-50">
            Nhập mã PIN do Host cung cấp
          </div>
        </form>
      </div>
    );
  }

  return <PlayerDashboard pin={pin} playerId={player.id} initialPlayer={player} />;
}
