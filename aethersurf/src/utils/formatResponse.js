// Format the response into a consistent structure for display
export const formatResponse = (response, model = 'default') => {
  if (!response) return [];

  // For streaming responses or simple text responses
  if (typeof response === 'string') {
    return [{
      title: "AI Response",
      content: response,
      type: 'text'
    }];
  }

  // For structured responses
  if (Array.isArray(response)) {
    return response.map((item, index) => ({
      title: item.title || `Step ${index + 1}`,
      content: item.content || item,
      type: item.type || 'text'
    }));
  }

  // For responses with steps
  if (response.steps) {
    return response.steps;
  }

  // Default case: wrap the response in a standard format
  return [{
    title: "AI Response",
    content: JSON.stringify(response),
    type: 'text'
  }];
};

// Parse and structure the streaming response
export const parseStreamingResponse = (response) => {
  return [{
    title: "AI Response",
    content: response,
    type: 'text'
  }];
};
