import * as openaiService from './openai';
import * as ollamaService from './ollama';

/**
 * Service type enum
 */
export const AI_SERVICE = {
  OPENAI: 'openai',
  OLLAMA: 'ollama',
};

/**
 * Get the appropriate service based on the selected type
 * @param {string} serviceType - The type of AI service to use
 * @returns {Object} The selected service module
 */
function getService(serviceType) {
  switch (serviceType) {
    case AI_SERVICE.OLLAMA:
      return ollamaService;
    case AI_SERVICE.OPENAI:
      return openaiService;
    default:
      throw new Error(`Unknown AI service type: ${serviceType}`);
  }
}

/**
 * Unified chat completion function that works with both services
 * @param {string} userMessage - The user's input message
 * @param {string} serviceType - The AI service to use
 * @param {string} model - The model to use (optional, for Ollama)
 * @returns {Promise<string>} The assistant's response
 */
export async function getChatCompletion(userMessage, serviceType = AI_SERVICE.OPENAI, model = null) {
  const service = getService(serviceType);
  
  if (serviceType === AI_SERVICE.OLLAMA && model) {
    return service.getChatCompletion(userMessage, model);
  }
  
  return service.getChatCompletion(userMessage);
}

/**
 * Unified streaming chat completion function
 * @param {string} userMessage - The user's input message
 * @param {Function} onChunk - Callback for handling streamed chunks
 * @param {string} serviceType - The AI service to use
 * @param {string} model - The model to use (optional, for Ollama)
 */
export async function getStreamingChatCompletion(userMessage, onChunk, serviceType = AI_SERVICE.OPENAI, model = null) {
  const service = getService(serviceType);
  
  if (serviceType === AI_SERVICE.OLLAMA && model) {
    return service.getStreamingChatCompletion(userMessage, onChunk, model);
  }
  
  return service.getStreamingChatCompletion(userMessage, onChunk);
}

/**
 * Get available models for the selected service
 * @param {string} serviceType - The AI service to use
 * @returns {Promise<Array>} List of available models
 */
export async function getAvailableModels(serviceType = AI_SERVICE.OPENAI) {
  if (serviceType === AI_SERVICE.OLLAMA) {
    return ollamaService.listModels();
  }
  
  // For OpenAI, we could return a static list of available models
  return ['gpt-4', 'gpt-3.5-turbo'];
}
