import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const VideosContent = ({ videos = [], isLoading = false }) => {
  const [playingVideo, setPlayingVideo] = useState(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-muted dark:bg-gray-800 rounded-lg mb-3"></div>
            <div className="h-4 bg-muted dark:bg-gray-800 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted dark:bg-gray-800 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-muted dark:bg-gray-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Play" size={48} className="text-muted-foreground dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">No videos found</h3>
        <p className="text-muted-foreground dark:text-gray-400">Try different search terms to find relevant video content.</p>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <div key={index} className="bg-card dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700 overflow-hidden hover:shadow-card dark:hover:shadow-gray-900 transition-smooth">
          <div className="relative aspect-video bg-muted dark:bg-gray-900">
            {playingVideo === index ? (
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer"
                     onClick={() => setPlayingVideo(index)}>
                  <div className="w-16 h-16 bg-white/90 dark:bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-smooth">
                    <Icon name="Play" size={24} className="text-foreground dark:text-gray-900 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 dark:bg-black/80 text-white dark:text-gray-100 text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              </>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground dark:text-white mb-2 line-clamp-2">
              {video.title}
            </h3>
            
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="User" size={14} className="text-muted-foreground dark:text-gray-400" />
              <span className="text-xs text-muted-foreground dark:text-gray-400 truncate">
                {video.channel}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Eye" size={12} className="text-muted-foreground dark:text-gray-400" />
                  <span>{video.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} className="text-muted-foreground dark:text-gray-400" />
                  <span>{video.publishedAt}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={12} className="text-warning dark:text-yellow-400" />
                <span className="font-medium dark:text-gray-300">{video.relevanceScore}/10</span>
              </div>
            </div>
            
            {video.description && (
              <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2 line-clamp-2">
                {video.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => setPlayingVideo(playingVideo === index ? null : index)}
                className="text-xs text-primary dark:text-primary hover:text-primary/80 dark:hover:text-primary/80 font-medium transition-smooth"
              >
                {playingVideo === index ? 'Close Player' : 'Watch Video'}
              </button>
              <a
                href={video.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-smooth flex items-center space-x-1"
              >
                <span>View on {video.platform}</span>
                <Icon name="ExternalLink" size={10} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideosContent;