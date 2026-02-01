// Free media search service using Pexels and Google links
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || ''; // Free tier: 200 requests/hour

// Extract keywords from text for better search
export function extractKeywords(text) {
  // Remove common words and get meaningful keywords
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'what', 'when', 'where', 'who', 'why', 'how'];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  // Get top 3 unique keywords
  return [...new Set(words)].slice(0, 3);
}

// Search images using Pexels API (free)
export async function searchImages(query, count = 6) {
  try {
    const keywords = extractKeywords(query).join(' ') || query;
    
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keywords)}&per_page=${count}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.warn('Pexels API failed, using Google links');
      return {
        images: [],
        googleLink: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`
      };
    }

    const data = await response.json();
    
    return {
      images: data.photos.map(photo => ({
        id: photo.id,
        url: photo.src.medium,
        thumbnail: photo.src.tiny,
        photographer: photo.photographer,
        source: 'Pexels'
      })),
      googleLink: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`
    };
  } catch (error) {
    console.error('Image search error:', error);
    return {
      images: [],
      googleLink: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`
    };
  }
}

// Search videos using Pexels API (free)
export async function searchVideos(query, count = 4) {
  try {
    const keywords = extractKeywords(query).join(' ') || query;
    
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(keywords)}&per_page=${count}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.warn('Pexels Video API failed, using Google links');
      return {
        videos: [],
        googleLink: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=vid`
      };
    }

    const data = await response.json();
    
    return {
      videos: data.videos.map(video => ({
        id: video.id,
        url: video.video_files[0]?.link,
        thumbnail: video.image,
        duration: video.duration,
        source: 'Pexels'
      })),
      googleLink: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=vid`
    };
  } catch (error) {
    console.error('Video search error:', error);
    return {
      videos: [],
      googleLink: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=vid`
    };
  }
}

// Get Google search links (always available)
export function getGoogleSearchLinks(query) {
  return {
    images: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`,
    videos: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=vid`,
    web: `https://www.google.com/search?q=${encodeURIComponent(query)}`
  };
}

// Fetch all media for a query
export async function fetchMediaForQuery(query) {
  const [imagesResult, videosResult] = await Promise.all([
    searchImages(query),
    searchVideos(query)
  ]);

  return {
    images: imagesResult.images,
    videos: videosResult.videos,
    googleLinks: getGoogleSearchLinks(query)
  };
}
