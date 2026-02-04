// Global Player State Management using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track } from '../types';

interface PlayerStore {
  // Current track
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isFullScreen: boolean;
  isMuted: boolean;
  
  // Queue management
  queue: Track[];
  queueIndex: number;
  
  // Favorites
  favorites: Track[];
  
  // Recently played
  recentlyPlayed: Track[];
  
  // Actions
  setCurrentTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setFullScreen: (isFullScreen: boolean) => void;
  
  // Queue actions
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  
  // Favorites actions
  addToFavorites: (track: Track) => void;
  removeFromFavorites: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  
  // Recently played
  addToRecentlyPlayed: (track: Track) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTrack: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
      volume: 0.8,
      isFullScreen: false,
      isMuted: false,
      queue: [],
      queueIndex: 0,
      favorites: [],
      recentlyPlayed: [],
      
      // Basic playback actions
      setCurrentTrack: (track) => {
        set({ currentTrack: track, progress: 0, isPlaying: true });
        get().addToRecentlyPlayed(track);
      },
      
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setProgress: (progress) => set({ progress }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setFullScreen: (isFullScreen) => set({ isFullScreen }),
      
      // Queue management
      addToQueue: (track) => set((state) => ({ 
        queue: [...state.queue, track] 
      })),
      
      removeFromQueue: (index) => set((state) => ({
        queue: state.queue.filter((_, i) => i !== index)
      })),
      
      clearQueue: () => set({ queue: [], queueIndex: 0 }),
      
      setQueue: (tracks, startIndex = 0) => {
        set({ queue: tracks, queueIndex: startIndex });
        if (tracks[startIndex]) {
          get().setCurrentTrack(tracks[startIndex]);
        }
      },
      
      playNext: () => {
        const { queue, queueIndex } = get();
        if (queueIndex < queue.length - 1) {
          const nextIndex = queueIndex + 1;
          set({ queueIndex: nextIndex });
          get().setCurrentTrack(queue[nextIndex]);
        }
      },
      
      playPrevious: () => {
        const { queue, queueIndex, progress } = get();
        // If more than 3 seconds into the song, restart it
        if (progress > 3) {
          set({ progress: 0 });
          return;
        }
        if (queueIndex > 0) {
          const prevIndex = queueIndex - 1;
          set({ queueIndex: prevIndex });
          get().setCurrentTrack(queue[prevIndex]);
        }
      },
      
      // Favorites management
      addToFavorites: (track) => set((state) => {
        if (state.favorites.find(t => t.id === track.id)) return state;
        return { favorites: [track, ...state.favorites] };
      }),
      
      removeFromFavorites: (trackId) => set((state) => ({
        favorites: state.favorites.filter(t => t.id !== trackId)
      })),
      
      isFavorite: (trackId) => {
        return get().favorites.some(t => t.id === trackId);
      },
      
      // Recently played
      addToRecentlyPlayed: (track) => set((state) => {
        const filtered = state.recentlyPlayed.filter(t => t.id !== track.id);
        return { 
          recentlyPlayed: [track, ...filtered].slice(0, 50) 
        };
      }),
    }),
    {
      name: 'cent-player-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyPlayed: state.recentlyPlayed,
        volume: state.volume,
      }),
    }
  )
);
