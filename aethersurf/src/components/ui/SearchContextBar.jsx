import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SearchContextBar = ({ 
  searchQuery, 
  selectedModel, 
  timestamp, 
  onRerunSearch, 
  onReturnToSearch,
  onClearContext 
}) => {
  if (!searchQuery) return null;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="sticky top-15 bg-background dark:bg-gray-900 border-b border-border dark:border-gray-800 z-900 transition-smooth">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Search Context Info */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-2 min-w-0">
              <Icon name="Search" size={16} className="text-muted-foreground dark:text-gray-400" />
              <span className="text-sm font-medium text-foreground dark:text-white truncate max-w-xs">
                "{searchQuery}"
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 dark:bg-primary/5 rounded-md">
                <Icon name="Cpu" size={14} className="text-primary dark:text-primary" />
                <span className="text-xs font-mono text-primary dark:text-primary">
                  {selectedModel || 'OpenAI'}
                </span>
              </div>
              
              {timestamp && (
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  {formatTimestamp(timestamp)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRerunSearch}
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={14}
              className="transition-smooth hover:bg-accent/10 dark:hover:bg-accent/5"
            >
              <span className="hidden sm:inline">Rerun</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onReturnToSearch}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={14}
              className="transition-smooth hover:bg-primary/10 dark:hover:bg-primary/5"
            >
              <span className="hidden sm:inline">Back to Search</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearContext}
              className="transition-smooth hover:bg-destructive/10 dark:hover:bg-destructive/5 dark:text-gray-400 dark:hover:text-destructive"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden mt-2 flex flex-wrap gap-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 dark:bg-primary/5 rounded-md">
            <Icon name="Cpu" size={12} className="text-primary dark:text-primary" />
            <span className="text-xs font-mono text-primary dark:text-primary">
              {selectedModel || 'OpenAI'}
            </span>
          </div>
          
          {timestamp && (
            <span className="text-xs text-muted-foreground dark:text-gray-400 px-2 py-1">
              {formatTimestamp(timestamp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContextBar;