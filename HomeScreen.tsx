import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, Disc, Sparkles, Clock, Music } from 'lucide-react';
import { useTrending, useNewReleases, useRecommendations } from '../hooks/useYouTube';
import { usePlayerStore } from '../store/playerStore';
import TrackCard from '../components/TrackCard';
import { Track } from '../types';

export default function HomeScreen() {
  const { tracks: trending, loading: trendingLoading, refresh: refreshTrending } = useTrending();
  const { tracks: newReleases, loading: newReleasesLoading, refresh: refreshNewReleases } = useNewReleases();
  const { tracks: recommendations, loading: recommendationsLoading, refresh: refreshRecommendations } = useRecommendations();
  
  const { recentlyPlayed, setCurrentTrack, setQueue } = usePlayerStore();

  const loading = trendingLoading || newReleasesLoading || recommendationsLoading;

  const handleRefresh = () => {
    refreshTrending();
    refreshNewReleases();
    refreshRecommendations();
  };

  const playTrack = (track: Track, queue: Track[]) => {
    const trackIndex = queue.findIndex(t => t.id === track.id);
    setQueue(queue, trackIndex >= 0 ? trackIndex : 0);
    setCurrentTrack(track);
  };

  const featuredPlaylists = [
    { id: '1', name: 'Top Hits 2024', image: 'https://picsum.photos/seed/playlist1/300/300', count: 50 },
    { id: '2', name: 'Chill Vibes', image: 'https://picsum.photos/seed/playlist2/300/300', count: 35 },
    { id: '3', name: 'Workout Energy', image: 'https://picsum.photos/seed/playlist3/300/300', count: 40 },
    { id: '4', name: 'Late Night Jazz', image: 'https://picsum.photos/seed/playlist4/300/300', count: 28 },
  ];

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome</h1>
          <p className="text-gray-400 mt-1">Discover your next favorite song</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRefresh}
          disabled={loading}
          className="p-3 rounded-full bg-gradient-to-br from-gold/20 to-champagne/20 text-gold disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </motion.button>
      </div>

      {/* Featured Playlists */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Music className="text-gold" size={20} />
          <h2 className="text-xl font-semibold text-white">Featured Playlists</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-xl overflow-hidden cursor-pointer group"
            >
              <div className="flex items-center gap-3 p-2">
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-14 h-14 rounded-lg object-cover group-hover:shadow-gold/30 group-hover:shadow-lg transition-shadow"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate text-sm">{playlist.name}</h3>
                  <p className="text-gray-400 text-xs">{playlist.count} tracks</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-gold" size={20} />
          <h2 className="text-xl font-semibold text-white">Trending Now</h2>
        </div>
        {trendingLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-44 flex-shrink-0 animate-pulse">
                <div className="w-44 h-44 bg-gray-800 rounded-xl mb-2" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {trending.map((track: Track, index: number) => (
              <TrackCard
                key={`trending-${track.id}-${index}`}
                track={track}
                onClick={() => playTrack(track, trending)}
                variant="large"
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* New Releases Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Disc className="text-champagne" size={20} />
          <h2 className="text-xl font-semibold text-white">New Releases</h2>
        </div>
        {newReleasesLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-36 flex-shrink-0 animate-pulse">
                <div className="w-36 h-36 bg-gray-800 rounded-xl mb-2" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {newReleases.map((track: Track, index: number) => (
              <TrackCard
                key={`new-${track.id}-${index}`}
                track={track}
                onClick={() => playTrack(track, newReleases)}
                variant="medium"
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recommendations Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-gold" size={20} />
          <h2 className="text-xl font-semibold text-white">Recommended For You</h2>
        </div>
        {recommendationsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-14 h-14 bg-gray-800 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {recommendations.slice(0, 6).map((track: Track, index: number) => (
              <TrackCard
                key={`rec-${track.id}-${index}`}
                track={track}
                onClick={() => playTrack(track, recommendations)}
                variant="list"
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-champagne" size={20} />
            <h2 className="text-xl font-semibold text-white">Recently Played</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {recentlyPlayed.slice(0, 10).map((track: Track, index: number) => (
              <TrackCard
                key={`recent-${track.id}-${index}`}
                track={track}
                onClick={() => playTrack(track, recentlyPlayed)}
                variant="small"
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export { HomeScreen };
