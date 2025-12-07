import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import { AI_SERVICE } from '../../services/ai';

const ModelSelector = ({ 
  selectedModel = AI_SERVICE.OPENAI, 
  onModelChange, 
  disabled = false,
  className = '' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const models = [
    { id: AI_SERVICE.OPENAI, name: 'OpenAI', icon: 'Zap' },
    { id: AI_SERVICE.OLLAMA, name: 'Ollama', icon: 'Cpu' }
  ];

  const handleToggle = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    const newModel = selectedModel === AI_SERVICE.OPENAI ? AI_SERVICE.OLLAMA : AI_SERVICE.OPENAI;
    
    if (onModelChange) {
      onModelChange(newModel);
    }
    
    // Store in localStorage for persistence
    localStorage.setItem('selectedModel', newModel);
    
    setTimeout(() => setIsAnimating(false), 200);
  };

  useEffect(() => {
    // Load from localStorage on mount
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel && savedModel !== selectedModel && onModelChange) {
      onModelChange(savedModel);
    }
  }, []);

  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  const isOpenAI = selectedModel === 'OpenAI';

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-text-secondary">AI Model:</span>
        
        <div 
          className={`
            group relative inline-flex items-center h-10 w-24 rounded-xl cursor-pointer
            transition-all duration-300 ease-out transform perspective-1000
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            ${isOpenAI 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] dark:shadow-[0_0_20px_rgba(96,165,250,0.3)]' 
              : 'bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-400 dark:to-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.5)] dark:shadow-[0_0_20px_rgba(34,211,238,0.3)]'}
            overflow-hidden border border-white/10 backdrop-blur-sm
          `}
          onClick={handleToggle}
        >
          {/* Animated Background Effect */}
          <div className={`
            absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
            bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]
            after:absolute after:inset-0 after:bg-gradient-to-t after:from-white/5 after:to-transparent
          `} />

          {/* Toggle Switch */}
          <div 
            className={`
              absolute w-8 h-8 rounded-lg shadow-lg transition-all duration-300 ease-out transform
              bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800
              flex items-center justify-center backdrop-blur-sm
              border border-white/50 dark:border-white/10
              ${isAnimating ? 'scale-110 rotate-180' : 'scale-100 rotate-0'}
              ${isOpenAI ? 'translate-x-1' : 'translate-x-15'}
              hover:shadow-xl hover:border-white/80 dark:hover:border-white/20
              group-hover:from-white group-hover:to-blue-100 dark:group-hover:from-gray-800 dark:group-hover:to-gray-700
            `}
          >
            <Icon 
              name={currentModel.icon} 
              size={16} 
              className={`transition-all duration-300 ${
                isOpenAI 
                  ? 'text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300' 
                  : 'text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300'
              }`}
            />
          </div>
          
          {/* Labels */}
          <div className="flex items-center justify-between w-full px-3 text-sm font-bold font-mono tracking-wider">
            <span className={`transition-all duration-300 ${
              isOpenAI 
                ? 'text-white/90 translate-y-0 opacity-100 text-shadow-sm' 
                : 'text-white/40 translate-y-1 opacity-50'
            }`}>
              AI
            </span>
            <span className={`transition-all duration-300 ${
              !isOpenAI 
                ? 'text-white/90 translate-y-0 opacity-100 text-shadow-sm' 
                : 'text-white/40 translate-y-1 opacity-50'
            }`}>
              OL
            </span>
          </div>
        </div>
        
        {/* Model Name Display */}
        <div className="flex items-center space-x-1">
          <Icon 
            name={currentModel.icon} 
            size={14}
            className={`${
              isOpenAI 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-cyan-500 dark:text-cyan-400'
            }`}
          />
          <span className={`text-sm font-semibold transition-smooth ${
            isOpenAI 
              ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' 
              : 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-700'
          } px-2 py-0.5 rounded-md border backdrop-blur-sm`}>
            {currentModel.name}
          </span>
        </div>
      </div>
      
      {/* Status Indicator */}
      {!disabled && (
        <div className={`ml-2 w-2 h-2 rounded-full transition-smooth ${
          isAnimating ? 'animate-pulse' : ''
        } ${isOpenAI ? 'bg-primary' : 'bg-secondary'}`} />
      )}
    </div>
  );
};

export default ModelSelector;