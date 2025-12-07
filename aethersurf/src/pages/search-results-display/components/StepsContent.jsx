import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const StepsContent = ({ content = [], isLoading = false }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted dark:bg-gray-800 rounded w-3/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted dark:bg-gray-800 rounded"></div>
            <div className="h-3 bg-muted dark:bg-gray-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="FileText" size={48} className="text-muted-foreground dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">No response available</h3>
        <p className="text-muted-foreground dark:text-gray-400">Try running a new search to get a response.</p>
      </div>
    );
  }

  // For AI responses (from Ollama/OpenAI)
  if (content.length === 1 && (content[0].title === "AI Response" || !content[0].title)) {
    return (
      <div className="bg-card dark:bg-gray-800/50 rounded-lg p-6 border border-border dark:border-gray-700">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">
            {content[0].content || content[0].description || content[0]}
          </div>
        </div>
      </div>
    );
  }

  // For structured content
  return (
    <div className="space-y-6">
      {content.map((step, index) => (
        <div key={index} className="bg-card dark:bg-gray-800/50 rounded-lg p-6 border border-border dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary dark:bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3">
                {step.title}
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground dark:text-gray-300 leading-relaxed mb-4">
                  {step.description}
                </p>
                {step.codeBlock && (
                  <div className="bg-muted dark:bg-gray-900 border border-border dark:border-gray-700 rounded-md p-4 font-mono text-sm overflow-x-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground dark:text-gray-400 uppercase tracking-wide">
                        {step.codeLanguage || 'Code'}
                      </span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(step.codeBlock).then(() => {
                            setCopiedIndex(index);
                            setTimeout(() => setCopiedIndex(null), 2000);
                          });
                        }}
                        className={`text-xs ${
                          copiedIndex === index 
                            ? 'text-success dark:text-green-400' 
                            : 'text-primary dark:text-primary hover:text-primary/80 dark:hover:text-primary/80'
                        } transition-all duration-200`}
                      >
                        {copiedIndex === index ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="text-foreground dark:text-gray-200 whitespace-pre-wrap">
                      {step.codeBlock}
                    </pre>
                  </div>
                )}
                {step.keyPoints && step.keyPoints.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-foreground dark:text-white mb-2">Key Points:</h4>
                    <ul className="space-y-1">
                      {step.keyPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsContent;
