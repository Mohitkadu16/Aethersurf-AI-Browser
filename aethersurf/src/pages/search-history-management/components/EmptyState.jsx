import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  type = "no-history", // no-history, no-results, error
  onAction,
  searchTerm = ""
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: 'SearchX',
          title: 'No results found',
          message: searchTerm 
            ? `No search history matches "${searchTerm}". Try adjusting your search terms or filters.`
            : 'No search history matches your current filters. Try adjusting your criteria.',
          actionText: 'Clear Filters',
          actionIcon: 'X'
        };
      
      case 'error':
        return {
          icon: 'AlertCircle',
          title: 'Unable to load history',
          message: 'There was an error loading your search history. Please try refreshing the page.',
          actionText: 'Refresh Page',
          actionIcon: 'RefreshCw'
        };
      
      default: // no-history
        return {
          icon: 'Clock',
          title: 'No search history yet',
          message: 'Your search history will appear here once you start using AetherSurf. Begin by performing your first search.',
          actionText: 'Start Searching',
          actionIcon: 'Search'
        };
    }
  };

  const { icon, title, message, actionText, actionIcon } = getEmptyStateContent();

  const handleAction = () => {
    if (type === 'no-history') {
      // Navigate to search interface
      window.location.href = '/main-search-interface';
    } else if (type === 'error') {
      // Refresh page
      window.location.reload();
    } else if (onAction) {
      // Custom action (like clearing filters)
      onAction();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Icon 
              name={icon} 
              size={32} 
              color="var(--color-text-secondary)" 
            />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          {title}
        </h3>
        
        <p className="text-text-secondary mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        <Button
          variant={type === 'error' ? 'outline' : 'default'}
          onClick={handleAction}
          iconName={actionIcon}
          iconPosition="left"
          iconSize={16}
        >
          {actionText}
        </Button>

        {/* Additional Help for No History State */}
        {type === 'no-history' && (
          <div className="mt-8 pt-6 border-t border-light">
            <h4 className="text-sm font-medium text-text-primary mb-3">
              What you can do with search history:
            </h4>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="RefreshCw" size={14} />
                <span>Re-run previous searches</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Star" size={14} />
                <span>Favorite important queries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Download" size={14} />
                <span>Export search data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Filter" size={14} />
                <span>Filter by date and model</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;