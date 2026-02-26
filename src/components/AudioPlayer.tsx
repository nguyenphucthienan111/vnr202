import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      // Autoplay might be blocked by browser, so we handle it gracefully
      const playAudio = () => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Ignore autoplay error
        });
      };
      document.addEventListener('click', playAudio, { once: true });
      return () => document.removeEventListener('click', playAudio);
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button 
        onClick={toggleMute}
        className="w-10 h-10 bg-[#2b2824] text-[#e6dfcc] rounded-full flex items-center justify-center shadow-lg hover:bg-[#5a554c] transition-colors"
        title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      <audio ref={audioRef} loop>
        <source src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" type="audio/ogg" />
        {/* Placeholder audio, replace with actual historical/heroic music */}
      </audio>
    </div>
  );
}
