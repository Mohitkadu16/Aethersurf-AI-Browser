import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchHistorySidebar = ({ 
  searchHistory = [], 
  onHistorySelect, 
  onClearHistory,
  isVisible = true,
  onToggleVisibility 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupedHistory = searchHistory.reduce((groups, item) => {
    const date = new Date(item.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      groupKey = 'This Week';
    } else {
      groupKey = 'Older';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});

  const handleHistoryClick = (item) => {
    if (onHistorySelect) {
      onHistorySelect(item);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="h-full bg-background dark:bg-gray-900 border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={18} className="text-foreground dark:text-gray-300" />
            <h2 className="text-sm font-medium text-foreground dark:text-white">Search History</h2>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6"
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
              className="h-6 w-6 lg:hidden"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          {/* History List */}
          <div className="flex-1 overflow-y-auto p-2">
            {searchHistory.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedHistory).map(([group, items]) => (
                  <div key={group}>
                    <h3 className="text-xs font-medium text-muted-foreground dark:text-gray-400 mb-2 px-2">
                      {group}
                    </h3>
                    <div className="space-y-1">
                      {items.map((item, index) => (
                        <div
                          key={`${group}-${index}`}
                          className="p-2 rounded-md hover:bg-muted dark:hover:bg-gray-800 cursor-pointer transition-quick group"
                          onClick={() => handleHistoryClick(item)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-foreground dark:text-gray-200 truncate group-hover:text-primary transition-quick">
                                {item.query}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Icon 
                                    name={item.model === 'OpenAI' ? 'Zap' : 'Cpu'} 
                                    size={10} 
                                    color={item.model === 'OpenAI' ? 'var(--color-primary)' : 'var(--color-secondary)'} 
                                  />
                                  <span className="text-xs font-mono text-muted-foreground dark:text-gray-400">
                                    {item.model}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground dark:text-gray-400">
                                  {formatTimestamp(item.timestamp)}
                                </span>
                              </div>
                              {item.resultCount && (
                                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                                  {item.resultCount} results
                                </div>
                              )}
                            </div>
                            <Icon 
                              name="ArrowUpRight" 
                              size={12} 
                              className="text-text-secondary group-hover:text-primary transition-quick opacity-0 group-hover:opacity-100 ml-2" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Icon name="Clock" size={32} className="text-muted-foreground dark:text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground dark:text-gray-400">No search history</p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                  Your searches will appear here
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {searchHistory.length > 0 && (
            <div className="p-4 border-t border-border dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={onClearHistory}
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
                className="text-destructive dark:text-red-400 hover:bg-destructive/10 dark:hover:bg-red-500/10 hover:border-destructive/20 dark:hover:border-red-500/20 transition-smooth"
              >
                Clear History
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchHistorySidebar;