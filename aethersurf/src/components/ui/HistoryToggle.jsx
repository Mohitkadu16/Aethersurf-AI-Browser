import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const HistoryToggle = ({ 
  historyData = [], 
  onHistorySelect, 
  isVisible = false, 
  onToggleVisibility 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage or props
    const recent = historyData.slice(0, 5) || [];
    setRecentSearches(recent);
  }, [historyData]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggleVisibility) {
      onToggleVisibility(newState);
    }
  };

  const handleHistoryItemClick = (item) => {
    if (onHistorySelect) {
      onHistorySelect(item);
    }
    setIsOpen(false);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={`transition-smooth ${isOpen ? 'bg-accent/10 text-accent' : 'hover:bg-muted'}`}
      >
        <Icon name="Clock" size={18} />
      </Button>

      {/* History Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 z-1050 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-popover border border-light rounded-lg shadow-elevated z-1100 transition-complex">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-primary">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>

              {recentSearches.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentSearches.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-md hover:bg-muted cursor-pointer transition-quick group"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-text-primary truncate group-hover:text-primary transition-quick">
                            {item.query || `Search ${index + 1}`}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs font-mono text-text-secondary">
                              {item.model || 'OpenAI'}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {formatTimestamp(item.timestamp)}
                            </span>
                          </div>
                        </div>
                        <Icon 
                          name="ArrowUpRight" 
                          size={14} 
                          className="text-text-secondary group-hover:text-primary transition-quick opacity-0 group-hover:opacity-100" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Icon name="Clock" size={32} className="text-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">No recent searches</p>
                </div>
              )}

              {recentSearches.length > 0 && (
                <div className="border-t border-light mt-3 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      // Navigate to full history page
                      window.location.href = '/search-history-management';
                      setIsOpen(false);
                    }}
                    iconName="ExternalLink"
                    iconPosition="right"
                    iconSize={14}
                    className="justify-between transition-smooth"
                  >
                    View All History
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryToggle;