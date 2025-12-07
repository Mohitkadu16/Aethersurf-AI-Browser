import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResultsSidebar = ({ 
  relatedSearches = [], 
  onRelatedSearchClick, 
  activeFilters = [], 
  onFilterChange 
}) => {
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);

  const contentFilters = [
    { id: 'all', label: 'All Content', icon: 'Grid3X3' },
    { id: 'text', label: 'Text Only', icon: 'FileText' },
    { id: 'images', label: 'Images Only', icon: 'Image' },
    { id: 'videos', label: 'Videos Only', icon: 'Play' }
  ];

  const exportFormats = [
    { id: 'txt', label: 'Text File (.txt)', icon: 'FileText' },
    { id: 'pdf', label: 'PDF Document (.pdf)', icon: 'FilePdf' },
    { id: 'docx', label: 'Word Document (.docx)', icon: 'FileWord' },
    { id: 'json', label: 'JSON File (.json)', icon: 'FileJson' }
  ];

  const shareOptions = [
    { id: 'copy', label: 'Copy Link', icon: 'Copy' },
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' },
    { id: 'instagram', label: 'Instagram', icon: 'Instagram' }
  ];

  const quickActions = [
    { id: 'save', label: 'Save Results', icon: 'Bookmark' },
    { id: 'share', label: 'Share Results', icon: 'Share2' },
    { id: 'export', label: 'Export Data', icon: 'Download' }
  ];

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'save':
        // Save to local storage or app backup
        const savedResults = {
          timestamp: new Date().toISOString(),
          searches: relatedSearches,
          filters: activeFilters
        };
        try {
          const existingSaves = JSON.parse(localStorage.getItem('savedSearches') || '[]');
          localStorage.setItem('savedSearches', JSON.stringify([...existingSaves, savedResults]));
          alert('Results saved successfully!');
        } catch (error) {
          console.error('Error saving results:', error);
          alert('Failed to save results. Please try again.');
        }
        break;

      case 'export':
        setShowExportModal(true);
        break;

      case 'share':
        setShowShareModal(true);
        break;
    }
  };

  const handleExport = (format) => {
    // Implementation for different export formats
    const data = {
      searches: relatedSearches,
      filters: activeFilters,
      timestamp: new Date().toISOString()
    };

    switch (format) {
      case 'txt':
        const textContent = JSON.stringify(data, null, 2);
        const textBlob = new Blob([textContent], { type: 'text/plain' });
        const textUrl = URL.createObjectURL(textBlob);
        const textLink = document.createElement('a');
        textLink.href = textUrl;
        textLink.download = 'search_results.txt';
        textLink.click();
        break;

      case 'json':
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = 'search_results.json';
        jsonLink.click();
        break;

      // For PDF and DOCX, we would typically use libraries like jsPDF or docx
      // This is a placeholder that shows an alert
      case 'pdf':
      case 'docx':
        alert(`Exporting as ${format.toUpperCase()} - This feature requires additional libraries`);
        break;
    }
    setShowExportModal(false);
  };

  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
          .then(() => alert('Link copied to clipboard!'))
          .catch(() => alert('Failed to copy link'));
        break;

      case 'email':
        window.location.href = `mailto:?subject=Search Results&body=${encodeURIComponent(shareUrl)}`;
        break;

      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
        break;

      case 'instagram':
        alert('Opening Instagram share - This would typically open Instagram sharing UI');
        break;
    }
    setShowShareModal(false);
  };

  return (
    <div className="w-80 bg-background dark:bg-gray-900 border-l border-border dark:border-gray-800 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {/* Quick Filters */}
        <div>
          <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3 flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-foreground dark:text-white" />
            <span>Quick Filters</span>
          </h3>
          <div className="space-y-2">
          {contentFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange && onFilterChange(filter.id)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-smooth
                ${activeFilters.includes(filter.id)
                  ? 'bg-primary dark:bg-primary text-white' 
                  : 'text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-gray-800'
                }
              `}
            >
              <Icon 
                name={filter.icon} 
                size={14} 
                className={activeFilters.includes(filter.id) ? 'text-white' : 'text-muted-foreground dark:text-gray-400'} 
              />
              <span>{filter.label}</span>
            </button>
          ))}
          </div>
        </div>

        {/* Related Searches */}
      {relatedSearches.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3 flex items-center space-x-2">
            <Icon name="Search" size={16} className="text-foreground dark:text-white" />
            <span>Related Searches</span>
          </h3>
          <div className="space-y-2">
            {relatedSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onRelatedSearchClick && onRelatedSearchClick(search)}
                className="w-full text-left p-3 bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-md hover:border-primary/30 dark:hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 transition-smooth group"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary transition-smooth truncate">
                      {search.query}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                      {search.resultCount} results
                    </p>
                  </div>
                  <Icon 
                    name="ArrowUpRight" 
                    size={14} 
                    className="text-muted-foreground dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary transition-smooth opacity-0 group-hover:opacity-100" 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3 flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-foreground dark:text-white" />
          <span>Quick Actions</span>
        </h3>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              fullWidth
              iconName={action.icon}
              iconPosition="left"
              iconSize={14}
              className="justify-start transition-smooth"
              onClick={() => handleQuickAction(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background dark:bg-gray-800 rounded-lg p-6 w-80 space-y-4">
            <h3 className="text-lg font-semibold text-foreground dark:text-white">Export Format</h3>
            <div className="space-y-2">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm hover:bg-muted dark:hover:bg-gray-700 transition-smooth"
                >
                  <Icon name={format.icon} size={16} />
                  <span>{format.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-4 px-4 py-2 border border-border dark:border-gray-600 rounded-md hover:bg-muted dark:hover:bg-gray-700 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background dark:bg-gray-800 rounded-lg p-6 w-80 space-y-4">
            <h3 className="text-lg font-semibold text-foreground dark:text-white">Share Results</h3>
            <div className="space-y-2">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm hover:bg-muted dark:hover:bg-gray-700 transition-smooth"
                >
                  <Icon name={option.icon} size={16} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 px-4 py-2 border border-border dark:border-gray-600 rounded-md hover:bg-muted dark:hover:bg-gray-700 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Tips */}
      <div className="bg-accent/10 dark:bg-accent/5 border border-accent/20 dark:border-accent/10 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-accent dark:text-accent/90 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground dark:text-white mb-1">Search Tips</h4>
            <ul className="text-xs text-muted-foreground dark:text-gray-400 space-y-1">
              <li>• Use specific keywords for better results</li>
              <li>• Try different AI models for varied perspectives</li>
              <li>• Save useful searches for future reference</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ResultsSidebar;