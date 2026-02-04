// Full Screen Player Component
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart, 
  ChevronDown,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic
} from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useState, useRef, useEffect } from 'react';

interface FullPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullPlayer({ isOpen, onClose }: FullPlayerProps) {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious,
    progress,
    duration,
    setProgress,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    addToFavorites,
    removeFromFavorites,
    favorites
  } = usePlayerStore();

  const [isDragging, setIsDragging] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const isFavorite = currentTrack ? favorites.some(t => t.id === currentTrack.id) : false;

  // Auto-increment progress for demo
  useEffect(() => {
    if (isPlaying && !isDragging && duration > 0) {
      const interval = setInterval(() => {
        setProgress(Math.min(progress + 1, duration));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, progress, duration, isDragging, setProgress]);

  // Set initial duration when track changes
  useEffect(() => {
    if (currentTrack) {
      // Parse duration string (e.g., "3:45" -> 225 seconds)
      const parts = currentTrack.duration.split(':');
      const totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      usePlayerStore.setState({ duration: totalSeconds });
    }
  }, [currentTrack]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setProgress(percent * duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFavorite = () => {
    if (!currentTrack) return;
    if (isFavorite) {
      removeFromFavorites(currentTrack.id);
    } else {
      addToFavorites(currentTrack);
    }
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          {/* Background with blur effect */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentTrack.thumbnail}
              alt=""
              className="h-full w-full scale-150 object-cover opacity-30 blur-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
          </div>

          {/* Content */}
          <div className="relative flex flex-1 flex-col px-6 py-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronDown size={28} />
              </motion.button>
              
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-[#D4AF37]">
                  Now Playing
                </p>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ListMusic size={24} />
              </motion.button>
            </div>

            {/* Album Art */}
            <div className="flex flex-1 items-center justify-center py-8">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 20, 
                  repeat: isPlaying ? Infinity : 0, 
                  ease: 'linear' 
                }}
                className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-full shadow-2xl shadow-[#D4AF37]/20"
              >
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="h-full w-full object-cover"
                />
                {/* Vinyl effect */}
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-[35%] rounded-full bg-black shadow-inner" />
                <div className="absolute inset-[40%] rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F1C40F]" />
              </motion.div>
            </div>

            {/* Track Info */}
            <div className="space-y-2 text-center">
              <motion.h2 
                key={currentTrack.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-white"
              >
                {currentTrack.title}
              </motion.h2>
              <p className="text-lg text-[#D4AF37]">{currentTrack.artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 space-y-2">
              <div
                ref={progressRef}
                onClick={handleProgressClick}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                className="group relative h-1.5 cursor-pointer rounded-full bg-white/20"
              >
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F]"
                  style={{ width: `${progressPercent}%` }}
                />
                <motion.div
                  className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#D4AF37] bg-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  style={{ left: `calc(${progressPercent}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white/50 transition-colors hover:text-white"
              >
                <Shuffle size={22} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={playPrevious}
                className="p-2 text-white transition-colors hover:text-[#D4AF37]"
              >
                <SkipBack size={32} fill="currentColor" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F1C40F] shadow-lg shadow-[#D4AF37]/40"
              >
                {isPlaying ? (
                  <Pause size={32} className="text-black" fill="black" />
                ) : (
                  <Play size={32} className="ml-1 text-black" fill="black" />
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={playNext}
                className="p-2 text-white transition-colors hover:text-[#D4AF37]"
              >
                <SkipForward size={32} fill="currentColor" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white/50 transition-colors hover:text-white"
              >
                <Repeat size={22} />
              </motion.button>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex items-center justify-between px-4 pb-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className="p-2"
              >
                <Heart
                  size={26}
                  className={isFavorite ? 'text-[#D4AF37]' : 'text-white/70'}
                  fill={isFavorite ? '#D4AF37' : 'none'}
                />
              </motion.button>

              {/* Volume Control */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVolume(!showVolume)}
                  onDoubleClick={toggleMute}
                  className="p-2 text-white/70 transition-colors hover:text-white"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={26} />
                  ) : (
                    <Volume2 size={26} />
                  )}
                </motion.button>

                <AnimatePresence>
                  {showVolume && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-white/10 p-3 backdrop-blur-xl"
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="h-24 w-2 cursor-pointer appearance-none rounded-full bg-white/20 accent-[#D4AF37]"
                        style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
