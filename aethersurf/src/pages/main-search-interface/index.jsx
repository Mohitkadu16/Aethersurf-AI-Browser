import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModelSelector from '../../components/ui/ModelSelector';
import OllamaModelSelector from '../../components/ui/OllamaModelSelector';
import SearchInput from './components/SearchInput';
import SearchHistorySidebar from './components/SearchHistorySidebar';
import SearchResultsTabs from './components/SearchResultsTabs';
import MobileHistorySheet from './components/MobileHistorySheet';
import Icon from '../../components/AppIcon';
import NavigationButtons from '../../components/ui/NavigationButtons';
import ExamplePrompts from '../../components/ui/ExamplePrompts';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { formatResponse, parseStreamingResponse } from '../../utils/formatResponse';

import Button from '../../components/ui/Button';
import { getStreamingChatCompletion, AI_SERVICE } from '../../services/ai';

const MainSearchInterface = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState(AI_SERVICE.OPENAI);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [query, setQuery] = useState('');
  const [currentSearch, setCurrentSearch] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Load selected models from localStorage
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel) {
      setSelectedModel(savedModel);
    }

    const savedOllamaModel = localStorage.getItem('selectedOllamaModel');
    if (savedOllamaModel) {
      setSelectedOllamaModel(savedOllamaModel);
    }

    // Restore current search if exists
    const savedCurrentSearch = localStorage.getItem('currentSearch');
    if (savedCurrentSearch) {
      const parsedSearch = JSON.parse(savedCurrentSearch);
      setCurrentSearch(parsedSearch);
      setSearchResults(parsedSearch.searchResults);
      setStreamingResponse(parsedSearch.response);
      // Update model selection based on saved search
      if (parsedSearch.model === AI_SERVICE.OLLAMA) {
        setSelectedModel(AI_SERVICE.OLLAMA);
        setSelectedOllamaModel(parsedSearch.modelName);
      }
    }
  }, []);

  // Save Ollama model selection
  useEffect(() => {
    if (selectedOllamaModel) {
      localStorage.setItem('selectedOllamaModel', selectedOllamaModel);
    }
  }, [selectedOllamaModel]);

  const handleModelChange = (model) => {
    setSelectedModel(model);
    localStorage.setItem('selectedModel', model);
    
    // Clear streaming response when switching models
    setStreamingResponse('');
    setError(null);
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setStreamingResponse('');
    const startTime = new Date();
    setCurrentSearch({ query, model: selectedModel, timestamp: startTime });

    try {
      if (selectedModel === AI_SERVICE.OLLAMA && !selectedOllamaModel) {
        throw new Error('Please select an Ollama model first');
      }

      // Use streaming for better UX with both OpenAI and Ollama
      let fullResponse = '';
      await getStreamingChatCompletion(
        query,
        (chunk) => {
          fullResponse += chunk;
          setStreamingResponse(fullResponse);
        },
        selectedModel,
        selectedModel === AI_SERVICE.OLLAMA ? selectedOllamaModel : null
      );
      
      // Format the response for display
      const formattedSteps = formatResponse(fullResponse, selectedModel);
      const searchResultsData = {
        steps: formattedSteps,
        images: [],
        videos: []
      };
      
      setSearchResults(searchResultsData);
      
      // Also update streaming display with properly formatted content
      setStreamingResponse(fullResponse);
      
      // Add to search history with full response data
      const newHistoryItem = {
        id: Date.now(),
        query,
        model: selectedModel,
        modelName: selectedModel === AI_SERVICE.OLLAMA ? selectedOllamaModel : 'OpenAI',
        timestamp: new Date(),
        resultCount: 1,
        response: fullResponse,
        originalResponse: fullResponse, // Store the original response
        searchResults: searchResultsData,
        status: 'success',
        responseTime: `${((Date.now() - startTime.getTime()) / 1000).toFixed(1)}s`,
        modelDetails: selectedModel === AI_SERVICE.OLLAMA ? {
          modelName: selectedOllamaModel,
          provider: 'Ollama'
        } : {
          modelName: 'GPT-3.5',
          provider: 'OpenAI'
        }
      };
      
      // Store the actual search results
      if (searchResultsData) {
        newHistoryItem.steps = searchResultsData.steps;
        newHistoryItem.images = searchResultsData.images;
        newHistoryItem.videos = searchResultsData.videos;
      }
      
      const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 50);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      
      // Store the current search state in localStorage
      localStorage.setItem('currentSearch', JSON.stringify({
        query,
        model: selectedModel,
        modelName: selectedModel === AI_SERVICE.OLLAMA ? selectedOllamaModel : 'OpenAI',
        timestamp: startTime,
        response: fullResponse,
        searchResults: searchResultsData
      }));

      // Navigate to results page
      navigate('/search-results-display');
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch search results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (historyItem) => {
    // Set the current search state with the history item
    setCurrentSearch(historyItem);
    
    // Restore the original model settings
    if (historyItem.model === AI_SERVICE.OLLAMA) {
      setSelectedModel(AI_SERVICE.OLLAMA);
      setSelectedOllamaModel(historyItem.modelDetails.modelName);
    } else {
      setSelectedModel(AI_SERVICE.OPENAI);
    }
    
    // Restore the search results from history
    setSearchResults({
      steps: historyItem.steps || [{
        title: "AI Response",
        content: historyItem.originalResponse || historyItem.response
      }],
      images: historyItem.images || [],
      videos: historyItem.videos || []
    });
    
    // Set the streaming response to show the stored response
    setStreamingResponse(historyItem.originalResponse || historyItem.response);
    
    setIsMobileHistoryOpen(false);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleCloseResults = () => {
    setCurrentSearch(null);
    setSearchResults(null);
    setStreamingResponse('');
    localStorage.removeItem('currentSearch');
  };

  const handleRetry = () => {
    if (currentSearch) {
      handleSearch(currentSearch.query);
    }
  };

  // This handleModelChange function is already defined above

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="h-screen flex pt-15">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:block transition-all duration-300 ${
          isSidebarVisible ? 'w-80' : 'w-0'
        } overflow-hidden`}>
          <SearchHistorySidebar
            searchHistory={searchHistory}
            onHistorySelect={handleHistorySelect}
            onClearHistory={handleClearHistory}
            isVisible={isSidebarVisible}
            onToggleVisibility={() => setIsSidebarVisible(!isSidebarVisible)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Main ChatGPT-like Interface */}
          <div className="flex-1 flex flex-col">
            {!currentSearch && (
              /* Initial Welcome Screen - ChatGPT Style */
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                {/* AI Name/Title */}
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-text-primary mb-2">
                    AetherSurf AI
                  </h1>
                  <p className="text-lg text-text-secondary">
                    How can I help you today?
                  </p>
                </div>

                {/* Search Input Section */}
                <div className="w-full max-w-3xl space-y-4">
                  {/* Model Selector and Search Input - Vertical Layout */}
                  <div className="flex flex-col space-y-4">
                    {/* Model Toggle Switch - Now on Top */}
                    <div className="flex flex-col items-center gap-2">
                      <ModelSelector
                        selectedModel={selectedModel}
                        onModelChange={handleModelChange}
                        disabled={isLoading}
                      />
                      {selectedModel === AI_SERVICE.OLLAMA && (
                        <OllamaModelSelector
                          selectedModel={selectedOllamaModel}
                          onModelChange={setSelectedOllamaModel}
                          disabled={isLoading}
                        />
                      )}
                    </div>
                    
                    {/* Search Input - Now Below Toggle */}
                    <div className="w-full">
                      <SearchInput
                        onSearch={handleSearch}
                        searchHistory={searchHistory}
                        isLoading={isLoading}
                        placeholder={`Ask ${selectedModel === AI_SERVICE.OLLAMA ? selectedOllamaModel || 'Ollama' : selectedModel} anything...`}
                        defaultQuery={query}
                      />
                    </div>
                    
                    {/* Example Prompts */}
                    <ExamplePrompts 
                      onPromptClick={(promptText) => {
                        setQuery(promptText);
                        handleSearch(promptText);
                      }} 
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <NavigationButtons />

                  {/* Mobile/Desktop History Toggle */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="ghost"
                      onClick={() => setIsMobileHistoryOpen(true)}
                      iconName="Clock"
                      iconPosition="left"
                      iconSize={16}
                      className="text-text-secondary lg:hidden"
                    >
                      History ({searchHistory.length})
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                      iconName={isSidebarVisible ? "ChevronLeft" : "ChevronRight"}
                      iconPosition="left"
                      iconSize={14}
                      className="text-text-secondary hidden lg:flex"
                    >
                      {isSidebarVisible ? 'Hide' : 'Show'} History
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section - Only show when there's a search */}
            {currentSearch && (
              <div className="flex-1 overflow-hidden">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseResults}
                    className="absolute right-4 top-4 z-10"
                    iconName="X"
                    iconPosition="left"
                  >
                    Close
                  </Button>
                  <SearchResultsTabs
                    searchResults={searchResults}
                    isLoading={isLoading}
                    error={error}
                    onRetry={handleRetry}
                    streamingResponse={streamingResponse}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile History Sheet */}
      <MobileHistorySheet
        isOpen={isMobileHistoryOpen}
        onClose={() => setIsMobileHistoryOpen(false)}
        searchHistory={searchHistory}
        onHistorySelect={handleHistorySelect}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default MainSearchInterface;