import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RandomEventProps {
  events: Array<{ message: string; timestamp: number; type?: string }>;
  showReactions?: boolean; // New prop to control reactions display
}

export default function RandomEvent({ events, showReactions = false }: RandomEventProps) {
  const [currentEvent, setCurrentEvent] = useState<{ message: string; type?: string } | null>(null);

  useEffect(() => {
    if (events.length === 0) return;
    
    // Get the latest event, filter out reactions if showReactions is false
    const filteredEvents = showReactions 
      ? events 
      : events.filter(e => e.type !== 'reaction');
    
    if (filteredEvents.length === 0) return;
    
    const latest = filteredEvents[filteredEvents.length - 1];
    
    // Show event
    setCurrentEvent(latest);
    
    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setCurrentEvent(null);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [events, showReactions]);

  return (
    <AnimatePresence>
      {currentEvent && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", damping: 15 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full mx-4"
        >
          <div className={`
            bg-[#f4ebd8] border-4 border-[#2b2824] p-6 shadow-[12px_12px_0px_rgba(43,40,36,1)]
            ${currentEvent.type === 'duel' ? 'border-[#8b1a1a]' : ''}
          `}>
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                {currentEvent.type === 'duel' ? '⚔️' : '📢'}
              </div>
              <div className="flex-1">
                <div className="typewriter-text text-xs uppercase tracking-widest mb-1 opacity-70">
                  {currentEvent.type === 'duel' ? 'Thách Đấu' : 'Sự Kiện'}
                </div>
                <div className="newspaper-title text-2xl font-black leading-tight">
                  {currentEvent.message}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
