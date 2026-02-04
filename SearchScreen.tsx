// Search Screen with Real-time Search
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Music, Mic, TrendingUp } from 'lucide-react';
import { useYouTubeSearch } from '../hooks/useYouTube';
import TrackCard from '../components/TrackCard';
import { usePlayerStore } from '../store/playerStore';
import type { Track } from '../types';

const GENRES = [
  { name: 'Pop', color: 'from-pink-500 to-rose-600', icon: '🎵' },
  { name: 'Hip Hop', color: 'from-purple-500 to-indigo-600', icon: '🎤' },
  { name: 'Rock', color: 'from-red-500 to-orange-600', icon: '🎸' },
  { name: 'Electronic', color: 'from-cyan-500 to-blue-600', icon: '🎧' },
  { name: 'R&B', color: 'from-violet-500 to-purple-600', icon: '💜' },
  { name: 'Jazz', color: 'from-amber-500 to-yellow-600', icon: '🎺' },
  { name: 'Classical', color: 'from-emerald-500 to-teal-600', icon: '🎻' },
  { name: 'Country', color: 'from-orange-500 to-amber-600', icon: '🤠' },
];

const TRENDING_SEARCHES = [
  'Summer Hits 2024',
  'Chill Lofi Beats',
  'Workout Motivation',
  'Top 40 Music',
  'Relaxing Piano',
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { results, loading } = useYouTubeSearch(query);
  const { setQueue } = usePlayerStore();

  const handleGenreClick = (genre: string) => {
    setQuery(`${genre} music hits`);
  };

  const handleTrendingClick = (search: string) => {
    setQuery(search);
  };

  const handlePlayAll = () => {
    if (results.length > 0) {
      setQueue(results as Track[], 0);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-black pb-40">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/90 px-4 pb-4 pt-6 backdrop-blur-xl">
        <h1 className="mb-4 text-2xl font-bold text-white">Search</h1>
        
        {/* Search Input */}
        <div className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
          isFocused ? 'ring-2 ring-[#D4AF37]' : ''
        }`}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search size={20} className="text-gray-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What do you want to listen to?"
            className="w-full bg-white/10 py-4 pl-12 pr-20 text-white placeholder-gray-500 outline-none"
          />
          
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={clearSearch}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </motion.button>
            )}
            <button className="rounded-full p-2 text-[#D4AF37] hover:bg-white/10">
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <AnimatePresence mode="wait">
          {/* Search Results */}
          {query.trim() && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {loading ? 'Searching...' : `Results for "${query}"`}
                </h2>
                {results.length > 0 && (
                  <button
                    onClick={handlePlayAll}
                    className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F] px-4 py-2 text-sm font-semibold text-black"
                  >
                    Play All
                  </button>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-8 w-8 rounded-full border-2 border-[#D4AF37] border-t-transparent"
                  />
                </div>
              )}

              {/* Results List */}
              {!loading && results.length > 0 && (
                <div className="space-y-2">
                  {results.map((track, index) => (
                    <TrackCard 
                      key={track.id} 
                      track={track as Track} 
                      index={index} 
                      variant="compact" 
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && query && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Music size={48} className="mb-4 text-gray-600" />
                  <p className="text-lg text-gray-400">No results found</p>
                  <p className="text-sm text-gray-500">Try a different search term</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Browse Categories (when not searching) */}
          {!query.trim() && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Trending Searches */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#D4AF37]" />
                  <h2 className="text-lg font-semibold text-white">Trending Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((search, index) => (
                    <motion.button
                      key={search}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTrendingClick(search)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10"
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Browse by Genre */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Browse by Genre</h2>
                <div className="grid grid-cols-2 gap-4">
                  {GENRES.map((genre, index) => (
                    <motion.button
                      key={genre.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleGenreClick(genre.name)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative h-24 overflow-hidden rounded-xl bg-gradient-to-br ${genre.color} p-4 text-left`}
                    >
                      <span className="text-2xl">{genre.icon}</span>
                      <h3 className="mt-2 font-bold text-white">{genre.name}</h3>
                      <div className="absolute -bottom-4 -right-4 text-6xl opacity-20">
                        {genre.icon}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Quick Picks */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Quick Picks</h2>
                <div className="grid grid-cols-3 gap-3">
                  {['Discover', 'Charts', 'New', 'Podcasts', 'Live', 'Events'].map((pick, index) => (
                    <motion.button
                      key={pick}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTrendingClick(pick)}
                      className="rounded-xl bg-white/5 p-4 text-center backdrop-blur-sm transition-all hover:bg-white/10"
                    >
                      <span className="text-sm font-medium text-white">{pick}</span>
                    </motion.button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
