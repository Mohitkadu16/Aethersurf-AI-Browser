import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HistoryCard = ({ 
  entry, 
  isSelected, 
  onSelect, 
  onRerun, 
  onDelete, 
  onToggleFavorite, 
  onViewResults,
  searchTerm = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-warning/30 dark:bg-warning/20 text-warning-foreground dark:text-warning">$1</mark>');
  };

  const getModelIcon = (model) => {
    return model === 'OpenAI' ? 'Zap' : 'Cpu';
  };

  const getModelColor = (model) => {
    return model === 'OpenAI' ? 'var(--color-primary)' : 'var(--color-secondary)';
  };

  return (
    <div className={`bg-card dark:bg-gray-800/50 border border-border dark:border-gray-700 rounded-lg transition-smooth hover:shadow-card dark:hover:shadow-gray-900 ${
      isSelected ? 'ring-2 ring-primary/20 dark:ring-primary/10 border-primary/30 dark:border-primary/20' : ''
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(entry.id, e.target.checked)}
                className="w-4 h-4 text-primary dark:text-primary bg-background dark:bg-gray-700 border-border dark:border-gray-600 rounded focus:ring-primary focus:ring-2"
              />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={getModelIcon(entry.model)} size={16} className={entry.model === 'OpenAI' ? 'text-primary dark:text-primary' : 'text-secondary dark:text-secondary'} />
                <span className="text-xs font-mono px-2 py-1 bg-muted dark:bg-gray-700 rounded-md text-foreground dark:text-gray-300">
                  {entry.model}
                </span>
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  {formatTimestamp(entry.timestamp)}
                </span>
                {entry.isFavorite && (
                  <Icon name="Star" size={14} color="var(--color-warning)" fill="var(--color-warning)" />
                )}
              </div>
              
              <h3 
                className="text-sm font-medium text-foreground dark:text-white mb-2 line-clamp-2"
                dangerouslySetInnerHTML={{ 
                  __html: highlightSearchTerm(entry.query, searchTerm) 
                }}
              />
              
              {entry.resultSummary && (
                <p className="text-xs text-muted-foreground dark:text-gray-400 line-clamp-2">
                  {entry.resultSummary}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewResults(entry)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="View Results"
            >
              <Icon name="Eye" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(entry.id)}
              className="h-8 w-8"
            >
              <Icon 
                name="Star" 
                size={14} 
                color={entry.isFavorite ? "var(--color-warning)" : "var(--color-text-secondary)"}
                fill={entry.isFavorite ? "var(--color-warning)" : "none"}
              />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={14} 
              />
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border dark:border-gray-700 pt-3 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="text-xs">
                <span className="text-muted-foreground dark:text-gray-400">Results:</span>
                <span className="ml-1 font-medium text-foreground dark:text-gray-200">{entry.resultCount || 0}</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground dark:text-gray-400">Response Time:</span>
                <span className="ml-1 font-medium text-foreground dark:text-gray-200">{entry.responseTime || 'N/A'}</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground dark:text-gray-400">Status:</span>
                <span className={`ml-1 font-medium ${
                  entry.status === 'success' ? 'text-success dark:text-green-400' : 'text-error dark:text-red-400'
                }`}>
                  {entry.status || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewResults(entry)}
                iconName="ExternalLink"
                iconPosition="left"
                iconSize={14}
              >
                View Results
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRerun(entry)}
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={14}
              >
                Re-run Search
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entry.id)}
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
                className="text-destructive dark:text-red-400 hover:text-destructive hover:bg-destructive/10 dark:hover:bg-red-500/10"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;