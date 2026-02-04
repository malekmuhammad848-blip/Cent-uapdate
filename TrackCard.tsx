// Track Card Component with Glassmorphism
import { motion } from 'framer-motion';
import { Play, Pause, Heart, MoreVertical } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import type { Track } from '../types';

interface TrackCardProps {
  track: Track;
  index?: number;
  variant?: 'small' | 'medium' | 'large' | 'list' | 'compact' | 'default';
  onClick?: () => void;
  showMenu?: boolean;
}

export default function TrackCard({ 
  track, 
  index = 0, 
  variant = 'default', 
  onClick,
  showMenu = false 
}: TrackCardProps) {
  const { currentTrack, isPlaying, setCurrentTrack, togglePlay, addToFavorites, removeFromFavorites, favorites } = usePlayerStore();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && isPlaying;
  const isFavorite = favorites.some(t => t.id === track.id);

  const handlePlay = () => {
    if (onClick) {
      onClick();
    } else if (isCurrentTrack) {
      togglePlay();
    } else {
      setCurrentTrack(track);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(track.id);
    } else {
      addToFavorites(track);
    }
  };

  // List variant - horizontal row
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        onClick={handlePlay}
        className={`group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-300 ${
          isCurrentTrack 
            ? 'bg-gradient-to-r from-gold/20 to-transparent border border-gold/20' 
            : 'glass-card hover:bg-white/10'
        }`}
      >
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="h-full w-full object-cover"
          />
          <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isCurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            {isTrackPlaying ? (
              <Pause size={18} className="text-gold" fill="currentColor" />
            ) : (
              <Play size={18} className="text-gold ml-0.5" fill="currentColor" />
            )}
          </div>
          {isTrackPlaying && (
            <div className="absolute inset-0 border-2 border-gold rounded-lg" />
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className={`truncate text-sm font-semibold ${
            isCurrentTrack ? 'text-gold' : 'text-white'
          }`}>
            {track.title}
          </h4>
          <p className="truncate text-xs text-gray-400">{track.artist}</p>
          {track.views && (
            <p className="text-xs text-gray-500">{track.views} views</p>
          )}
        </div>
        
        <button
          onClick={handleFavorite}
          className="flex-shrink-0 p-2 transition-all hover:scale-110"
        >
          <Heart
            size={18}
            className={isFavorite ? 'text-gold' : 'text-gray-500 group-hover:text-gray-300'}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
        
        <span className="flex-shrink-0 text-xs text-gray-500 min-w-[40px] text-right">{track.duration}</span>

        {showMenu && (
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <MoreVertical size={18} />
          </button>
        )}
      </motion.div>
    );
  }

  // Compact variant - for search results
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={handlePlay}
        className={`group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-300 ${
          isCurrentTrack 
            ? 'bg-gradient-to-r from-gold/20 to-transparent' 
            : 'hover:bg-white/5'
        }`}
      >
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="h-full w-full object-cover"
          />
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
            isCurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            {isTrackPlaying ? (
              <Pause size={20} className="text-gold" fill="currentColor" />
            ) : (
              <Play size={20} className="text-gold" fill="currentColor" />
            )}
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className={`truncate text-sm font-semibold ${
            isCurrentTrack ? 'text-gold' : 'text-white'
          }`}>
            {track.title}
          </h4>
          <p className="truncate text-xs text-gray-400">{track.artist}</p>
        </div>
        
        <button
          onClick={handleFavorite}
          className="flex-shrink-0 p-2 transition-transform hover:scale-110"
        >
          <Heart
            size={18}
            className={isFavorite ? 'text-gold' : 'text-gray-500'}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
        
        <span className="flex-shrink-0 text-xs text-gray-500">{track.duration}</span>
      </motion.div>
    );
  }

  // Large variant - featured cards
  if (variant === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        onClick={handlePlay}
        className="group cursor-pointer w-44 flex-shrink-0"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Play button overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isCurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-champagne shadow-lg shadow-gold/30"
            >
              {isTrackPlaying ? (
                <Pause size={28} className="text-black" fill="black" />
              ) : (
                <Play size={28} className="ml-1 text-black" fill="black" />
              )}
            </motion.div>
          </div>
          
          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className={`truncate text-base font-bold ${
              isCurrentTrack ? 'text-gold' : 'text-white'
            }`}>
              {track.title}
            </h3>
            <p className="truncate text-sm text-gray-300">{track.artist}</p>
          </div>
          
          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute right-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Heart
              size={18}
              className={isFavorite ? 'text-gold' : 'text-white'}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>

          {/* Views badge */}
          {track.views && (
            <div className="absolute left-3 top-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              <span className="text-xs text-white">{track.views}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Medium variant
  if (variant === 'medium') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={handlePlay}
        className="group w-36 flex-shrink-0 cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <motion.div
            className={`absolute inset-0 flex items-center justify-center transition-opacity ${
              isCurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold to-champagne shadow-lg">
              {isTrackPlaying ? (
                <Pause size={22} className="text-black" fill="black" />
              ) : (
                <Play size={22} className="ml-0.5 text-black" fill="black" />
              )}
            </div>
          </motion.div>

          <button
            onClick={handleFavorite}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <Heart
              size={14}
              className={isFavorite ? 'text-gold' : 'text-white'}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
        
        <div className="mt-2 space-y-0.5">
          <h4 className={`truncate text-sm font-semibold ${
            isCurrentTrack ? 'text-gold' : 'text-white'
          }`}>
            {track.title}
          </h4>
          <p className="truncate text-xs text-gray-400">{track.artist}</p>
        </div>
      </motion.div>
    );
  }

  // Small variant - for recently played
  if (variant === 'small') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        onClick={handlePlay}
        className="group w-28 flex-shrink-0 cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
            isCurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/90">
              {isTrackPlaying ? (
                <Pause size={16} className="text-black" fill="black" />
              ) : (
                <Play size={16} className="ml-0.5 text-black" fill="black" />
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <h4 className={`truncate text-xs font-medium ${
            isCurrentTrack ? 'text-gold' : 'text-white'
          }`}>
            {track.title}
          </h4>
          <p className="truncate text-xs text-gray-500">{track.artist}</p>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handlePlay}
      className="group w-40 flex-shrink-0 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <motion.div
          initial={false}
          animate={{ opacity: isCurrentTrack ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-champagne">
            {isTrackPlaying ? (
              <Pause size={20} className="text-black" fill="black" />
            ) : (
              <Play size={20} className="ml-0.5 text-black" fill="black" />
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="mt-3 space-y-1">
        <h4 className={`truncate text-sm font-semibold ${
          isCurrentTrack ? 'text-gold' : 'text-white'
        }`}>
          {track.title}
        </h4>
        <p className="truncate text-xs text-gray-400">{track.artist}</p>
      </div>
    </motion.div>
  );
}

// Named export for compatibility
export { TrackCard };
