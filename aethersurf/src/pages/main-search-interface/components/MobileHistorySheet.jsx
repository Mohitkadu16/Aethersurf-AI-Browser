import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MobileHistorySheet = ({ 
  isOpen, 
  onClose, 
  searchHistory = [], 
  onHistorySelect, 
  onClearHistory 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatTimestamp = (timestamp) => {
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

  const handleHistoryClick = (item) => {
    onHistorySelect(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-1100 transition-smooth"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-1200 max-h-[80vh] flex flex-col transition-complex">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-border rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} color="var(--color-text-primary)" />
            <h2 className="text-lg font-medium text-text-primary">Search History</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {searchHistory.length > 0 ? (
            <div className="space-y-3 pb-6">
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-card rounded-lg border border-light hover:bg-muted cursor-pointer transition-quick"
                  onClick={() => handleHistoryClick(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary mb-2">
                        {item.query}
                      </p>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Icon 
                            name={item.model === 'OpenAI' ? 'Zap' : 'Cpu'} 
                            size={12} 
                            color={item.model === 'OpenAI' ? 'var(--color-primary)' : 'var(--color-secondary)'} 
                          />
                          <span className="text-xs font-mono text-text-secondary">
                            {item.model}
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary">
                          {formatTimestamp(item.timestamp)}
                        </span>
                        {item.resultCount && (
                          <span className="text-xs text-text-secondary">
                            {item.resultCount} results
                          </span>
                        )}
                      </div>
                    </div>
                    <Icon name="ArrowUpRight" size={16} className="text-text-secondary ml-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Clock" size={48} className="text-text-secondary mb-4" />
              <p className="text-text-secondary mb-2">No search history</p>
              <p className="text-xs text-text-secondary">
                Your searches will appear here
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {searchHistory.length > 0 && (
          <div className="p-6 border-t border-light">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                onClearHistory();
                onClose();
              }}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
              className="text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-smooth"
            >
              Clear All History
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileHistorySheet;