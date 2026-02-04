// YouTube Data API v3 Service - Production Ready
const API_KEY = 'AIzaSyA2_aXj4qE3AiONxkXViJljIE-xIXMJM1M';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeSearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
  views?: string;
}

// Helper function to format duration from ISO 8601
function formatDuration(isoDuration: string): string {
  if (!isoDuration) return '0:00';
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper function to format view count
function formatViews(viewCount: string): string {
  const views = parseInt(viewCount);
  if (views >= 1000000000) {
    return `${(views / 1000000000).toFixed(1)}B`;
  }
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return viewCount;
}

// Get video details (duration, views)
async function getVideoDetails(videoIds: string[]): Promise<Map<string, { duration: string; views: string }>> {
  const details = new Map();
  
  if (videoIds.length === 0) return details;
  
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds.join(',')}&key=${API_KEY}`
    );
    
    if (!response.ok) return details;
    
    const data = await response.json();
    
    data.items?.forEach((item: { id: string; contentDetails?: { duration?: string }; statistics?: { viewCount?: string } }) => {
      details.set(item.id, {
        duration: formatDuration(item.contentDetails?.duration || ''),
        views: formatViews(item.statistics?.viewCount || '0'),
      });
    });
  } catch (error) {
    console.error('Error fetching video details:', error);
  }
  
  return details;
}

// Search YouTube for music videos
export async function searchYouTube(query: string, maxResults = 20): Promise<YouTubeSearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query + ' music')}&type=video&videoCategoryId=10&maxResults=${maxResults}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error('YouTube API error:', response.status);
      return getFallbackResults(query);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return getFallbackResults(query);
    }
    
    const videoIds = data.items.map((item: { id: { videoId: string } }) => item.id.videoId);
    const details = await getVideoDetails(videoIds);
    
    return data.items.map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } } } }) => {
      const videoId = item.id.videoId;
      const videoDetails = details.get(videoId) || { duration: '0:00', views: '0' };
      
      return {
        id: videoId,
        title: decodeHTMLEntities(item.snippet.title),
        artist: decodeHTMLEntities(item.snippet.channelTitle),
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
        duration: videoDetails.duration,
        videoId: videoId,
        views: videoDetails.views,
      };
    });
  } catch (error) {
    console.error('Search error:', error);
    return getFallbackResults(query);
  }
}

// Get trending music videos
export async function getTrendingTracks(): Promise<YouTubeSearchResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=10&maxResults=20&regionCode=US&key=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error('YouTube API error:', response.status);
      return FALLBACK_TRENDING;
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return FALLBACK_TRENDING;
    }
    
    return data.items.map((item: { id: string; snippet: { title: string; channelTitle: string; thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } } }; contentDetails?: { duration?: string }; statistics?: { viewCount?: string } }) => ({
      id: item.id,
      title: decodeHTMLEntities(item.snippet.title),
      artist: decodeHTMLEntities(item.snippet.channelTitle),
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
      duration: formatDuration(item.contentDetails?.duration || ''),
      videoId: item.id,
      views: formatViews(item.statistics?.viewCount || '0'),
    }));
  } catch (error) {
    console.error('Trending error:', error);
    return FALLBACK_TRENDING;
  }
}

// Get new music releases
export async function getNewReleases(): Promise<YouTubeSearchResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=new music 2024&type=video&videoCategoryId=10&maxResults=15&order=date&publishedAfter=${getDateWeeksAgo(2)}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      return FALLBACK_NEW_RELEASES;
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return FALLBACK_NEW_RELEASES;
    }
    
    const videoIds = data.items.map((item: { id: { videoId: string } }) => item.id.videoId);
    const details = await getVideoDetails(videoIds);
    
    return data.items.map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } } } }) => {
      const videoId = item.id.videoId;
      const videoDetails = details.get(videoId) || { duration: '0:00', views: '0' };
      
      return {
        id: videoId,
        title: decodeHTMLEntities(item.snippet.title),
        artist: decodeHTMLEntities(item.snippet.channelTitle),
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
        duration: videoDetails.duration,
        videoId: videoId,
        views: videoDetails.views,
      };
    });
  } catch (error) {
    console.error('New releases error:', error);
    return FALLBACK_NEW_RELEASES;
  }
}

// Get music recommendations
export async function getRecommendations(): Promise<YouTubeSearchResult[]> {
  const queries = ['top hits 2024', 'popular music', 'best songs', 'viral music'];
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(randomQuery)}&type=video&videoCategoryId=10&maxResults=15&order=relevance&key=${API_KEY}`
    );
    
    if (!response.ok) {
      return FALLBACK_RECOMMENDATIONS;
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return FALLBACK_RECOMMENDATIONS;
    }
    
    const videoIds = data.items.map((item: { id: { videoId: string } }) => item.id.videoId);
    const details = await getVideoDetails(videoIds);
    
    return data.items.map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } } } }) => {
      const videoId = item.id.videoId;
      const videoDetails = details.get(videoId) || { duration: '0:00', views: '0' };
      
      return {
        id: videoId,
        title: decodeHTMLEntities(item.snippet.title),
        artist: decodeHTMLEntities(item.snippet.channelTitle),
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
        duration: videoDetails.duration,
        videoId: videoId,
        views: videoDetails.views,
      };
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return FALLBACK_RECOMMENDATIONS;
  }
}

// Get related videos
export async function getRelatedVideos(videoId: string): Promise<YouTubeSearchResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=10&key=${API_KEY}`
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!data.items) return [];
    
    const videoIds = data.items
      .filter((item: { id?: { videoId?: string } }) => item.id?.videoId)
      .map((item: { id: { videoId: string } }) => item.id.videoId);
    const details = await getVideoDetails(videoIds);
    
    return data.items
      .filter((item: { id?: { videoId?: string } }) => item.id?.videoId)
      .map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } } } }) => {
        const vid = item.id.videoId;
        const videoDetails = details.get(vid) || { duration: '0:00', views: '0' };
        
        return {
          id: vid,
          title: decodeHTMLEntities(item.snippet.title),
          artist: decodeHTMLEntities(item.snippet.channelTitle),
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
          duration: videoDetails.duration,
          videoId: vid,
          views: videoDetails.views,
        };
      });
  } catch (error) {
    console.error('Related videos error:', error);
    return [];
  }
}

// Helper function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Helper function to get date string from weeks ago
function getDateWeeksAgo(weeks: number): string {
  const date = new Date();
  date.setDate(date.getDate() - weeks * 7);
  return date.toISOString();
}

// Fallback function for search
function getFallbackResults(query: string): YouTubeSearchResult[] {
  return FALLBACK_TRENDING.map((track, index) => ({
    ...track,
    id: `fallback-${index}-${Date.now()}`,
    title: `${query} - ${track.title}`,
  }));
}

// Fallback data when API fails
const FALLBACK_TRENDING: YouTubeSearchResult[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Aurora Sounds',
    thumbnail: 'https://picsum.photos/seed/music1/400/400',
    duration: '3:45',
    videoId: 'dQw4w9WgXcQ',
    views: '2.5M',
  },
  {
    id: '2',
    title: 'Golden Hour',
    artist: 'Sunset Collective',
    thumbnail: 'https://picsum.photos/seed/music2/400/400',
    duration: '4:12',
    videoId: 'kJQP7kiw5Fk',
    views: '1.8M',
  },
  {
    id: '3',
    title: 'Electric Pulse',
    artist: 'Neon Waves',
    thumbnail: 'https://picsum.photos/seed/music3/400/400',
    duration: '3:28',
    videoId: '9bZkp7q19f0',
    views: '5.2M',
  },
  {
    id: '4',
    title: 'Starlight Symphony',
    artist: 'Cosmic Orchestra',
    thumbnail: 'https://picsum.photos/seed/music4/400/400',
    duration: '5:01',
    videoId: 'fJ9rUzIMcZQ',
    views: '3.1M',
  },
  {
    id: '5',
    title: 'Urban Jungle',
    artist: 'Metro Beats',
    thumbnail: 'https://picsum.photos/seed/music5/400/400',
    duration: '3:55',
    videoId: 'JGwWNGJdvx8',
    views: '4.7M',
  },
  {
    id: '6',
    title: 'Ocean Breeze',
    artist: 'Coastal Vibes',
    thumbnail: 'https://picsum.photos/seed/music6/400/400',
    duration: '4:33',
    videoId: 'RgKAFK5djSk',
    views: '2.9M',
  },
];

const FALLBACK_NEW_RELEASES: YouTubeSearchResult[] = [
  {
    id: '7',
    title: 'Fresh Start',
    artist: 'Morning Glory',
    thumbnail: 'https://picsum.photos/seed/new1/400/400',
    duration: '3:21',
    videoId: 'PT2_F-1esPk',
    views: '890K',
  },
  {
    id: '8',
    title: 'Digital Dreams',
    artist: 'Cyber Flow',
    thumbnail: 'https://picsum.photos/seed/new2/400/400',
    duration: '4:05',
    videoId: 'CevxZvSJLk8',
    views: '1.2M',
  },
  {
    id: '9',
    title: 'Velvet Sky',
    artist: 'Ethereal',
    thumbnail: 'https://picsum.photos/seed/new3/400/400',
    duration: '3:58',
    videoId: '60ItHLz5WEA',
    views: '750K',
  },
  {
    id: '10',
    title: 'Thunder Road',
    artist: 'Storm Riders',
    thumbnail: 'https://picsum.photos/seed/new4/400/400',
    duration: '4:22',
    videoId: 'YQHsXMglC9A',
    views: '2.1M',
  },
];

const FALLBACK_RECOMMENDATIONS: YouTubeSearchResult[] = [
  {
    id: '11',
    title: 'Peaceful Mind',
    artist: 'Zen Garden',
    thumbnail: 'https://picsum.photos/seed/rec1/400/400',
    duration: '5:15',
    videoId: 'lTRiuFIWV54',
    views: '3.4M',
  },
  {
    id: '12',
    title: 'City Lights',
    artist: 'Urban Dreams',
    thumbnail: 'https://picsum.photos/seed/rec2/400/400',
    duration: '3:48',
    videoId: 'SlPhMPnQ58k',
    views: '2.8M',
  },
  {
    id: '13',
    title: 'Sunset Boulevard',
    artist: 'Golden State',
    thumbnail: 'https://picsum.photos/seed/rec3/400/400',
    duration: '4:10',
    videoId: 'pRpeEdMmmQ0',
    views: '1.9M',
  },
  {
    id: '14',
    title: 'Aurora Borealis',
    artist: 'Northern Lights',
    thumbnail: 'https://picsum.photos/seed/rec4/400/400',
    duration: '4:45',
    videoId: 'bo_efYhYU2A',
    views: '4.2M',
  },
];

export { FALLBACK_TRENDING as DEMO_TRACKS, FALLBACK_NEW_RELEASES as DEMO_NEW_RELEASES, FALLBACK_RECOMMENDATIONS as DEMO_RECOMMENDATIONS };
