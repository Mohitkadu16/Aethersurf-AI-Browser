import React from 'react';

const AIResponse = ({ response, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted dark:bg-gray-800 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-muted dark:bg-gray-800 rounded"></div>
          <div className="h-3 bg-muted dark:bg-gray-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <div className="whitespace-pre-wrap">
        {response}
      </div>
    </div>
  );
};

export default AIResponse;
