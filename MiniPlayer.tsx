// Mini Player Component - Shows at bottom when track is playing
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, ChevronUp } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';

interface MiniPlayerProps {
  onExpand: () => void;
}

export default function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const { currentTrack, isPlaying, togglePlay, playNext, progress, duration } = usePlayerStore();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-16 left-2 right-2 z-30 overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl"
      >
        {/* Progress bar */}
        <div className="absolute left-0 right-0 top-0 h-0.5 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F]"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <div className="flex items-center gap-3 p-3">
          {/* Album Art */}
          <motion.div
            onClick={onExpand}
            className="relative h-12 w-12 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <ChevronUp size={16} className="text-white" />
            </div>
          </motion.div>

          {/* Track Info */}
          <div className="min-w-0 flex-1" onClick={onExpand}>
            <h4 className="truncate text-sm font-semibold text-white">
              {currentTrack.title}
            </h4>
            <p className="truncate text-xs text-gray-400">{currentTrack.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F1C40F]"
            >
              {isPlaying ? (
                <Pause size={20} className="text-black" fill="black" />
              ) : (
                <Play size={20} className="ml-0.5 text-black" fill="black" />
              )}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={playNext}
              className="p-2 text-white/70 transition-colors hover:text-white"
            >
              <SkipForward size={22} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
