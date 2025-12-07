import React, { useState, useEffect } from 'react';
import { listModels } from '../../services/ollama';
import Select from './Select';
import Icon from '../AppIcon';

const OllamaModelSelector = ({ 
  selectedModel,
  onModelChange,
  disabled = false,
  className = ''
}) => {
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const models = await listModels();
      setAvailableModels(models.map(model => ({
        value: model.name,
        label: model.name
      })));
      
      // If we have models and no model is selected, select the first one
      if (models.length > 0 && !selectedModel) {
        onModelChange(models[0].name);
      }
    } catch (err) {
      console.error('Failed to load Ollama models:', err);
      setError('Failed to load models. Check if Ollama is running at');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg max-w-md">
        <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
          <Icon name="AlertCircle" className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm whitespace-pre-line">{error}</div>
        </div>
        <div className="flex items-center gap-2 ml-7">
          <button
            onClick={loadModels}
            className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <Icon name="RefreshCw" className="w-4 h-4" />
            Retry Connection
          </button>
          <a
            href="http://localhost:11434"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <Icon name="Globe" className="w-4 h-4" />
            Open Localhost
          </a>
          <a
            href="https://ollama.ai/download"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <Icon name="Download" className="w-4 h-4" />
            Install Ollama
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select
        value={selectedModel}
        onChange={value => onModelChange(value)}
        options={availableModels}
        disabled={disabled || isLoading}
        placeholder={isLoading ? "Loading models..." : "Select a model"}
        className="w-48 bg-[#2563eb] dark:bg-[#2563eb] text-white border-0 rounded-lg"
      />
      {isLoading && (
        <Icon name="Loader" className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-300" />
      )}
      <button
        onClick={loadModels}
        className="p-2 bg-[#2563eb] dark:bg-[#2563eb] rounded-lg text-white border-0 hover:bg-[#1d4ed8] dark:hover:bg-[#1d4ed8] transition-colors"
        title="Refresh models"
      >
        <Icon name="RefreshCw" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default OllamaModelSelector;
