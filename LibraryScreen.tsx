// Library Screen - User's saved favorites and playlists
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, ListMusic, Plus, Play, Trash2, Music } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import TrackCard from '../components/TrackCard';
import type { Track } from '../types';

type LibraryTab = 'favorites' | 'recent' | 'playlists';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('favorites');
  const { favorites, recentlyPlayed, setQueue, removeFromFavorites } = usePlayerStore();

  const tabs = [
    { id: 'favorites' as LibraryTab, label: 'Favorites', icon: Heart, count: favorites.length },
    { id: 'recent' as LibraryTab, label: 'Recent', icon: Clock, count: recentlyPlayed.length },
    { id: 'playlists' as LibraryTab, label: 'Playlists', icon: ListMusic, count: 0 },
  ];

  const handlePlayAll = (tracks: Track[]) => {
    if (tracks.length > 0) {
      setQueue(tracks, 0);
    }
  };

  const handleClearAll = () => {
    favorites.forEach((track) => removeFromFavorites(track.id));
  };

  return (
    <div className="min-h-screen bg-black pb-40">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/90 px-4 pb-2 pt-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Your Library</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            <Plus size={22} />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F1C40F] text-black'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive ? 'bg-black/20' : 'bg-white/10'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {favorites.length > 0 ? (
                <>
                  {/* Actions Bar */}
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-transparent p-4">
                    <div>
                      <h3 className="font-semibold text-white">
                        {favorites.length} {favorites.length === 1 ? 'Song' : 'Songs'}
                      </h3>
                      <p className="text-sm text-gray-400">Your favorite tracks</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClearAll}
                        className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePlayAll(favorites)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F]"
                      >
                        <Play size={24} className="ml-1 text-black" fill="black" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Favorites List */}
                  <div className="space-y-2">
                    {favorites.map((track, index) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        index={index}
                        variant="compact"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<Heart size={48} />}
                  title="No favorites yet"
                  description="Songs you like will appear here. Start exploring and save your favorites!"
                />
              )}
            </motion.div>
          )}

          {/* Recent Tab */}
          {activeTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {recentlyPlayed.length > 0 ? (
                <>
                  {/* Actions Bar */}
                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                    <div>
                      <h3 className="font-semibold text-white">Recently Played</h3>
                      <p className="text-sm text-gray-400">
                        {recentlyPlayed.length} tracks in history
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePlayAll(recentlyPlayed)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F]"
                    >
                      <Play size={24} className="ml-1 text-black" fill="black" />
                    </motion.button>
                  </div>

                  {/* Recent List */}
                  <div className="space-y-2">
                    {recentlyPlayed.map((track, index) => (
                      <TrackCard
                        key={`${track.id}-${index}`}
                        track={track}
                        index={index}
                        variant="compact"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<Clock size={48} />}
                  title="No recent plays"
                  description="Start playing music to build your listening history"
                />
              )}
            </motion.div>
          )}

          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <motion.div
              key="playlists"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Create Playlist Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center gap-4 rounded-xl border border-dashed border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 transition-colors hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F1C40F]">
                  <Plus size={28} className="text-black" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Create Playlist</h3>
                  <p className="text-sm text-gray-400">Build your perfect mix</p>
                </div>
              </motion.button>

              {/* Sample Playlists */}
              <div className="space-y-3">
                {[
                  { name: 'Liked Songs', count: favorites.length, gradient: 'from-purple-600 to-blue-600' },
                  { name: 'Discover Weekly', count: 30, gradient: 'from-green-600 to-emerald-600' },
                  { name: 'Release Radar', count: 25, gradient: 'from-orange-600 to-red-600' },
                ].map((playlist, index) => (
                  <motion.div
                    key={playlist.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex cursor-pointer items-center gap-4 rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10"
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${playlist.gradient}`}>
                      <Music size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{playlist.name}</h3>
                      <p className="text-sm text-gray-400">{playlist.count} songs</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="rounded-full p-2 text-white/50 transition-colors hover:text-[#D4AF37]"
                    >
                      <Play size={22} fill="currentColor" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 text-gray-600">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="max-w-xs text-sm text-gray-400">{description}</p>
    </motion.div>
  );
}
