// Updated handleSearch function with IndexedDB and media fetching
// Replace the existing handleSearch in main-search-interface/index.jsx

const handleSearch = async (searchQuery) => {
  setIsLoading(true);
  setError(null);
  setStreamingResponse('');
  const startTime = new Date();
  setCurrentSearch({ query: searchQuery, model: selectedModel, timestamp: startTime });

  // Create abort controller
  const controller = new AbortController();
  setAbortController(controller);

  try {
    if (selectedModel === AI_SERVICE.OLLAMA && !selectedOllamaModel) {
      throw new Error('Please select an Ollama model first');
    }

    // Create or get conversation
    let conversation = currentConversation;
    if (!conversation) {
      conversation = await conversationDB.createConversation(
        searchQuery,
        selectedModel,
        selectedModel === AI_SERVICE.OLLAMA ? selectedOllamaModel : 'OpenAI'
      );
      setCurrentConversation(conversation);
    }

    // Add user message
    await conversationDB.addMessage(conversation.id, {
      role: 'user',
      content: searchQuery
    });

    // Stream AI response
    let fullResponse = '';
    await getStreamingChatCompletion(
      searchQuery,
      (chunk) => {
        fullResponse += chunk;
        setStreamingResponse(fullResponse);
      },
      selectedModel,
      selectedModel === AI_SERVICE.OLLAMA ? selectedOllamaModel : null,
      controller.signal
    );

    // Fetch media automatically
    console.log('Fetching media for:', searchQuery);
    const mediaResults = await fetchMediaForQuery(searchQuery);
    
    // Format response
    const formattedSteps = formatResponse(fullResponse, selectedModel);
    const searchResultsData = {
      steps: formattedSteps,
      images: mediaResults.images || [],
      videos: mediaResults.videos || [],
      googleLinks: mediaResults.googleLinks
    };
    
    setSearchResults(searchResultsData);

    // Save assistant message with media
    await conversationDB.addMessage(conversation.id, {
      role: 'assistant',
      content: fullResponse,
      images: mediaResults.images || [],
      videos: mediaResults.videos || [],
      googleLinks: mediaResults.googleLinks
    });

    // Update state
    const updatedConversation = await conversationDB.getConversation(conversation.id);
    setConversationHistory(updatedConversation.messages);

    // Refresh conversations list
    const allConversations = await conversationDB.getAllConversations();
    setConversations(allConversations);

  } catch (err) {
    console.error('Search error:', err);
    if (err.message !== 'Response generation stopped') {
      setError(err.message || 'Failed to fetch search results. Please try again.');
    }
  } finally {
    setIsLoading(false);
    setAbortController(null);
  }
};
