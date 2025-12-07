import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { useTheme } from '../../hooks/useTheme';
import SearchContextBar from '../../components/ui/SearchContextBar';
import TabNavigation from './components/TabNavigation';
import StepsContent from './components/StepsContent';
import ImagesContent from './components/ImagesContent';
import VideosContent from './components/VideosContent';
import ResultsSidebar from './components/ResultsSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SearchResultsDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('steps');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Get actual search context from localStorage
  const [searchContext, setSearchContext] = useState(() => {
    const stored = localStorage.getItem('currentSearch');
    if (!stored) {
      navigate('/main-search-interface');
      return null;
    }
    return JSON.parse(stored);
  });

  // Get actual results data
  const [resultsData, setResultsData] = useState(() => {
    const stored = localStorage.getItem('currentSearch');
    if (!stored) return null;
    
    const parsedData = JSON.parse(stored);
    return {
      steps: parsedData.searchResults?.steps || [{
        title: "AI Response",
        content: parsedData.response,
        description: parsedData.response
      }],
      images: parsedData.searchResults?.images || [],
      videos: parsedData.searchResults?.videos || []
    };
  });

  // Redirect if no data
  useEffect(() => {
    if (!searchContext || !resultsData) {
      navigate('/main-search-interface');
    }
  }, [searchContext, resultsData, navigate]);

  const resultCounts = {
    steps: resultsData?.steps?.length || 0,
    images: resultsData?.images?.length || 0,
    videos: resultsData?.videos?.length || 0
  };

  const handleRerunSearch = () => {
    navigate('/main-search-interface', { 
      state: { 
        rerunQuery: searchContext.query 
      } 
    });
  };

  const handleReturnToSearch = () => {
    navigate('/main-search-interface');
  };

  const handleClearContext = () => {
    localStorage.removeItem('currentSearch');
    navigate('/main-search-interface');
  };

  const renderTabContent = () => {
    if (!resultsData) {
      return (
        <div className="text-center py-12">
          <Icon name="AlertCircle" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No results available. Please return to search.</p>
          <Button onClick={handleReturnToSearch} className="mt-4">
            Return to Search
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case 'steps':
        return (
          <StepsContent 
            content={resultsData.steps} 
            isLoading={isLoading} 
          />
        );
      case 'images':
        return (
          <ImagesContent 
            images={resultsData.images} 
            isLoading={isLoading} 
          />
        );
      case 'videos':
        return (
          <VideosContent 
            videos={resultsData.videos} 
            isLoading={isLoading} 
          />
        );
      default:
        return null;
    }
  };

  if (!searchContext || !resultsData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <SearchContextBar
        searchQuery={searchContext.query}
        selectedModel={searchContext.model}
        timestamp={searchContext.timestamp}
        onRerunSearch={handleRerunSearch}
        onReturnToSearch={handleReturnToSearch}
        onClearContext={handleClearContext}
      />

      <div className="flex">
        {/* Main Content Area */}
        <div className={`flex-1 transition-smooth ${isSidebarVisible ? 'mr-80' : ''}`}>
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            resultCounts={resultCounts}
          />

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-1000 transition-smooth ${
            isSidebarVisible ? 'translate-x-0' : 'translate-x-0'
          }`}
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <Icon name={isSidebarVisible ? "ChevronRight" : "ChevronLeft"} size={20} />
        </Button>
      </div>
    </div>
  );
};

export default SearchResultsDisplay;
