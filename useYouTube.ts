import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  searchYouTube, 
  getTrendingTracks, 
  getNewReleases, 
  getRecommendations,
  getRelatedVideos,
  YouTubeSearchResult 
} from '../services/youtubeApi';
import { Track } from '../types';

// Convert YouTube result to Track format
function toTrack(result: YouTubeSearchResult): Track {
  return {
    id: result.id,
    title: result.title,
    artist: result.artist,
    thumbnail: result.thumbnail,
    duration: result.duration,
    videoId: result.videoId,
    views: result.views,
  };
}

// Hook for searching YouTube - accepts query as parameter
export function useYouTubeSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchYouTube(query);
        setResults(data.map(toTrack));
      } catch (err) {
        setError('Failed to search. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults, query };
}

// Hook for trending tracks
export function useTrending() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrendingTracks();
      setTracks(data.map(toTrack));
    } catch (err) {
      setError('Failed to load trending tracks');
      console.error('Trending error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return { tracks, loading, error, refresh: fetchTrending };
}

// Hook for new releases
export function useNewReleases() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewReleases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNewReleases();
      setTracks(data.map(toTrack));
    } catch (err) {
      setError('Failed to load new releases');
      console.error('New releases error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewReleases();
  }, [fetchNewReleases]);

  return { tracks, loading, error, refresh: fetchNewReleases };
}

// Hook for recommendations
export function useRecommendations() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendations();
      setTracks(data.map(toTrack));
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Recommendations error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { tracks, loading, error, refresh: fetchRecommendations };
}

// Hook for related videos
export function useRelatedVideos(videoId: string | null) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) {
      setTracks([]);
      return;
    }

    const fetchRelated = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRelatedVideos(videoId);
        setTracks(data.map(toTrack));
      } catch (err) {
        setError('Failed to load related videos');
        console.error('Related videos error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [videoId]);

  return { tracks, loading, error };
}

// Hook for YouTube audio player using iframe
export function useYouTubePlayer() {
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadVideo = useCallback((videoId: string) => {
    if (playerRef.current) {
      const src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&origin=${window.location.origin}`;
      playerRef.current.src = src;
      setIsReady(true);
    }
  }, []);

  const play = useCallback(() => {
    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${seconds}, true]}`, '*');
      setCurrentTime(seconds);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":[${volume * 100}]}`, '*');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    playerRef,
    isReady,
    currentTime,
    duration,
    setDuration,
    loadVideo,
    play,
    pause,
    seekTo,
    setVolume,
    setCurrentTime,
  };
}
