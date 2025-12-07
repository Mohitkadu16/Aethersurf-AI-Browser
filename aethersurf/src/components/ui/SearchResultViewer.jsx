import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SearchResultViewer = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const data = {
      query: result.query,
      response: result.response,
      model: result.modelName,
      timestamp: result.timestamp,
      metadata: {
        responseTime: result.responseTime,
        status: result.status
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `search-result-${new Date(result.timestamp).toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Search Result',
        text: `Query: ${result.query}\nResponse: ${result.response}`,
      }).catch(console.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Icon 
              name={result.model === 'OpenAI' ? 'Zap' : 'Cpu'} 
              className={result.model === 'OpenAI' ? 'text-blue-500' : 'text-cyan-500'}
              size={18} 
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Search Result
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {result.modelName} • {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {/* Query */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Query:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {result.query}
                </p>
              </div>
            </div>

            {/* Response */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Response:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {result.response}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Response time: {result.responseTime}</span>
              <span>Status: <span className="text-green-500">{result.status}</span></span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <Icon name={copied ? "Check" : "Copy"} size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Icon name="Download" size={16} />
            Download
          </Button>
          {navigator.share && (
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Icon name="Share2" size={16} />
              Share
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultViewer;
