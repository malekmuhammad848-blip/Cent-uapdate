// Core types for the Cent Music App

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
  views?: string;
  publishedAt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tracks: Track[];
  trackCount: number;
}

export interface SearchResult {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration?: string;
  videoId: string;
  publishedAt: string;
  viewCount?: string;
}

export interface YouTubeSearchResponse {
  items: YouTubeVideoItem[];
  nextPageToken?: string;
}

export interface YouTubeVideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
      medium: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

export type TabType = 'home' | 'search' | 'library';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isFullScreen: boolean;
  queue: Track[];
  queueIndex: number;
}
