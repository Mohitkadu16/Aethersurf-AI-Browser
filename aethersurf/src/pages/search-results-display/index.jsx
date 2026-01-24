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
import { getStreamingChatCompletion, AI_SERVICE } from '../../services/ai';
import { formatResponse } from '../../utils/formatResponse';

const SearchResultsDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('steps');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [followUpInput, setFollowUpInput] = useState('');
  const [abortController, setAbortController] = useState(null);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

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

  // Initialize conversation history
  useEffect(() => {
    if (searchContext && searchContext.response) {
      setConversationHistory([
        { role: 'user', content: searchContext.query, timestamp: searchContext.timestamp },
        { role: 'assistant', content: searchContext.response, timestamp: new Date() }
      ]);
    }
  }, []);

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

  const handleFollowUp = async (followUpQuery) => {
    setIsLoading(true);
    setStreamingResponse('');
    setFollowUpInput('');

    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Add user message to conversation
      const userMessage = { role: 'user', content: followUpQuery, timestamp: new Date() };
      const updatedHistory = [...conversationHistory, userMessage];
      setConversationHistory(updatedHistory);

      // Get model info
      const model = searchContext.model === 'openai' ? AI_SERVICE.OPENAI : AI_SERVICE.OLLAMA;
      const modelName = searchContext.modelName;

      // Stream the response
      let fullResponse = '';
      await getStreamingChatCompletion(
        followUpQuery,
        (chunk) => {
          fullResponse += chunk;
          setStreamingResponse(fullResponse);
        },
        model,
        model === AI_SERVICE.OLLAMA ? modelName : null,
        controller.signal
      );

      // Format and update results
      const formattedSteps = formatResponse(fullResponse, model);
      const newResultsData = {
        steps: formattedSteps,
        images: [],
        videos: []
      };
      setResultsData(newResultsData);

      // Add assistant message to conversation
      const assistantMessage = { role: 'assistant', content: fullResponse, timestamp: new Date() };
      setConversationHistory([...updatedHistory, assistantMessage]);

      // Update localStorage
      const updatedSearch = {
        ...searchContext,
        response: fullResponse,
        searchResults: newResultsData
      };
      localStorage.setItem('currentSearch', JSON.stringify(updatedSearch));
      setSearchContext(updatedSearch);

    } catch (err) {
      console.error('Follow-up error:', err);
      if (err.message !== 'Response generation stopped') {
        // Handle error
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
      setStreamingResponse('');
    }
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
      
      if (streamingResponse) {
        const formattedSteps = formatResponse(streamingResponse, searchContext.model);
        const newResultsData = {
          steps: formattedSteps,
          images: [],
          videos: []
        };
        setResultsData(newResultsData);
      }
    }
  };

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    if (followUpInput.trim()) {
      handleFollowUp(followUpInput.trim());
    }
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
          <Icon name="AlertCircle" size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No results available. Please return to search.</p>
          <Button onClick={handleReturnToSearch} className="mt-4">
            Return to Search
          </Button>
        </div>
      );
    }

    // Show streaming response if loading
    if (isLoading && streamingResponse) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Loader2" size={16} className="animate-spin text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">AI is responding...</span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleStopGeneration}
              iconName="Square"
              iconPosition="left"
            >
              Stop
            </Button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
              {streamingResponse}
              <span className="animate-pulse">|</span>
            </div>
          </div>
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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <HeaderNavigation />
      
      <SearchContextBar
        searchQuery={searchContext.query}
        selectedModel={searchContext.model}
        timestamp={searchContext.timestamp}
        onRerunSearch={handleRerunSearch}
        onReturnToSearch={handleReturnToSearch}
        onClearContext={handleClearContext}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-smooth ${isSidebarVisible ? 'mr-80' : ''}`}>
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            resultCounts={resultCounts}
          />

          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>

          {/* Follow-up Input Bar */}
          {!isLoading && (
            <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleFollowUpSubmit} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                  <Button
                    type="submit"
                    disabled={!followUpInput.trim()}
                    iconName="Send"
                    iconPosition="right"
                    className="px-6"
                  >
                    Send
                  </Button>
                </form>
              </div>
            </div>
          )}
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
