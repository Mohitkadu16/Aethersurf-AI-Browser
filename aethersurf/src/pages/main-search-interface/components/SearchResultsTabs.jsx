import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StepsContent from '../../search-results-display/components/StepsContent';
import ImagesContent from '../../search-results-display/components/ImagesContent';
import VideosContent from '../../search-results-display/components/VideosContent';
import IntroAnimation from '../../../components/IntroAnimation';

const SearchResultsTabs = ({ 
  searchResults, 
  isLoading = false, 
  error = null, 
  onRetry,
  streamingResponse = '' 
}) => {
  const [activeTab, setActiveTab] = useState('steps');

  const tabs = [
    { id: 'steps', label: 'Answer', icon: 'FileText', count: searchResults?.steps?.length || 0 },
    { id: 'images', label: 'Images', icon: 'Image', count: searchResults?.images?.length || 0 },
    { id: 'videos', label: 'Videos', icon: 'Play', count: searchResults?.videos?.length || 0 }
  ];

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Something went wrong</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <Button onClick={onRetry} iconName="RefreshCw" iconPosition="left">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show streaming response during loading
  if (isLoading && streamingResponse) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface rounded-lg border border-light p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Loader2" size={16} className="animate-spin text-primary" />
              <span className="text-sm text-text-secondary">AI is responding...</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-text-primary">
                {streamingResponse}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Searching...</h3>
          <p className="text-text-secondary">Please wait while we find the best results for you</p>
        </div>
      </div>
    );
  }

  if (!searchResults) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Ready to search</h3>
          <p className="text-text-secondary">Enter your query above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <IntroAnimation />
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 border-b-2 transition-quick text-sm font-medium
                  ${activeTab === tab.id 
                    ? 'border-[#2563eb] text-[#2563eb] dark:border-[#3b82f6] dark:text-[#3b82f6]' 
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'steps' && (
          <StepsContent steps={searchResults.steps || []} />
        )}
        {activeTab === 'images' && (
          <ImagesContent images={searchResults.images || []} />
        )}
        {activeTab === 'videos' && (
          <VideosContent videos={searchResults.videos || []} />
        )}
      </div>
    </div>
  );
};

export default SearchResultsTabs;