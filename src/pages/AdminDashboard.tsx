import { useState } from 'react';
import { useGameRoom, triggerEvent } from '../hooks/useGame';

export default function AdminDashboard() {
  const [pin, setPin] = useState('');
  const [activePin, setActivePin] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePin(pin);
  };

  if (!activePin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2b2824] text-[#e6dfcc] font-mono p-4 selection:bg-[#e6dfcc] selection:text-[#2b2824]">
        <form onSubmit={handleConnect} className="bg-[#1a1815] p-8 border-2 border-[#5a554c] shadow-[8px_8px_0px_0px_rgba(90,85,76,1)] w-full max-w-md relative">
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#5a554c]"></div>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#5a554c]"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#5a554c]"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#5a554c]"></div>
          
          <h1 className="text-2xl font-bold mb-6 typewriter-text text-center border-b border-[#5a554c] pb-4">ADMIN_TERMINAL</h1>
          <input 
            type="text" 
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="ENTER_ROOM_PIN"
            className="w-full bg-black border border-[#5a554c] text-[#e6dfcc] p-3 mb-6 focus:outline-none focus:border-[#8b0000] tracking-widest text-center"
          />
          <button type="submit" className="w-full bg-[#8b0000] text-[#e6dfcc] p-3 font-bold hover:bg-[#a00000] transition-colors typewriter-text tracking-widest">
            CONNECT
          </button>
        </form>
      </div>
    );
  }

  return <AdminPanel pin={activePin} />;
}

function AdminPanel({ pin }: { pin: string }) {
  const { room, loading } = useGameRoom(pin);
  const [customEvent, setCustomEvent] = useState('');

  if (loading || !room) return <div className="min-h-screen bg-[#2b2824] text-[#e6dfcc] font-mono p-8 typewriter-text animate-pulse">CONNECTING...</div>;

  const players = Object.values(room.players || {});
  const totalFund = room.fund || 0;

  const handleTriggerEvent = async (msg: string) => {
    await triggerEvent(pin, msg);
  };

  return (
    <div className="min-h-screen bg-[#2b2824] text-[#e6dfcc] font-mono p-4 md:p-8 selection:bg-[#e6dfcc] selection:text-[#2b2824]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Stats */}
        <div className="col-span-1 space-y-6">
          <div className="bg-[#1a1815] p-6 border-2 border-[#5a554c] shadow-[4px_4px_0px_0px_rgba(90,85,76,1)]">
            <h2 className="text-xl font-bold mb-4 text-[#8b0000] typewriter-text border-b border-[#5a554c] pb-2">ROOM_STATUS</h2>
            <div className="space-y-3 typewriter-text text-sm">
              <div className="flex justify-between border-b border-dashed border-[#5a554c] pb-1"><span>PIN:</span> <span className="text-[#e6dfcc]">{pin}</span></div>
              <div className="flex justify-between border-b border-dashed border-[#5a554c] pb-1"><span>STATUS:</span> <span className="text-[#e6dfcc]">{room.status}</span></div>
              <div className="flex justify-between border-b border-dashed border-[#5a554c] pb-1"><span>PLAYERS:</span> <span className="text-[#e6dfcc]">{players.length}</span></div>
              <div className="flex justify-between border-b border-dashed border-[#5a554c] pb-1"><span>TOTAL_FUND:</span> <span className="text-[#e6dfcc]">{totalFund}</span></div>
            </div>
          </div>

          <div className="bg-[#1a1815] p-6 border-2 border-[#5a554c] shadow-[4px_4px_0px_0px_rgba(90,85,76,1)]">
            <h2 className="text-xl font-bold mb-4 text-[#8b0000] typewriter-text border-b border-[#5a554c] pb-2">TRIGGER_EVENTS</h2>
            <div className="space-y-4">
              <button 
                onClick={() => handleTriggerEvent("Cảnh sát Pháp đang tuần tra, các đồng chí phải tản ra!")}
                className="w-full bg-[#8b0000]/20 border border-[#8b0000] p-3 text-sm hover:bg-[#8b0000]/40 transition-colors text-left font-bold"
              >
                [!] Cảnh sát Pháp tuần tra
              </button>
              <button 
                onClick={() => handleTriggerEvent("Báo Dân Chúng vừa xuất bản số mới, tinh thần quần chúng lên cao!")}
                className="w-full bg-green-900/20 border border-green-900 p-3 text-sm hover:bg-green-900/40 transition-colors text-left font-bold"
              >
                [+] Báo Dân Chúng xuất bản
              </button>
              <button 
                onClick={() => handleTriggerEvent("Mật thám đang theo dõi, tạm dừng trao đổi tài liệu!")}
                className="w-full bg-yellow-900/20 border border-yellow-900 p-3 text-sm hover:bg-yellow-900/40 transition-colors text-left font-bold"
              >
                [!] Mật thám theo dõi
              </button>
              
              <div className="pt-6 border-t border-[#5a554c]">
                <input 
                  type="text" 
                  value={customEvent}
                  onChange={e => setCustomEvent(e.target.value)}
                  placeholder="Custom event message..."
                  className="w-full bg-black border border-[#5a554c] p-3 mb-3 text-sm focus:outline-none focus:border-[#e6dfcc]"
                />
                <button 
                  onClick={() => {
                    if (customEvent) {
                      handleTriggerEvent(customEvent);
                      setCustomEvent('');
                    }
                  }}
                  className="w-full bg-[#5a554c] p-3 text-sm hover:bg-[#7a756c] transition-colors font-bold tracking-widest"
                >
                  SEND_CUSTOM_EVENT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Players */}
        <div className="col-span-1 md:col-span-2 bg-[#1a1815] p-6 border-2 border-[#5a554c] shadow-[4px_4px_0px_0px_rgba(90,85,76,1)]">
          <h2 className="text-xl font-bold mb-4 text-[#8b0000] typewriter-text border-b border-[#5a554c] pb-2">PLAYER_DATABASE</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm typewriter-text">
              <thead>
                <tr className="border-b-2 border-[#5a554c] text-[#8b0000]">
                  <th className="pb-3 px-2">ID</th>
                  <th className="pb-3 px-2">NAME</th>
                  <th className="pb-3 px-2">ROLE</th>
                  <th className="pb-3 px-2 text-right">RESOURCES</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center opacity-50 italic">NO_DATA_FOUND</td>
                  </tr>
                ) : (
                  players.map(p => (
                    <tr key={p.id} className="border-b border-[#5a554c]/30 hover:bg-[#2b2824] transition-colors">
                      <td className="py-3 px-2 opacity-50 font-mono">{p.id.split('_')[2]}</td>
                      <td className="py-3 px-2 font-bold">{p.name}</td>
                      <td className="py-3 px-2">{p.role}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-[#e6dfcc]">{p.resources}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
