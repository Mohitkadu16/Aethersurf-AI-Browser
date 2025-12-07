/**
 * Service for interacting with Ollama API
 */

const OLLAMA_BASE_URL = 'http://localhost:11434'; // Default Ollama server URL

/**
 * Checks if Ollama service is running and accessible
 * @returns {Promise<boolean>} True if Ollama is running and accessible
 */
async function checkOllamaConnection() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Generates a chat completion response using Ollama.
 * @param {string} userMessage - The user's input message.
 * @param {string} model - The Ollama model to use (e.g., 'llama2', 'mistral', etc.)
 * @returns {Promise<string>} The assistant's response.
 */
export async function getChatCompletion(userMessage, model = 'llama2') {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: userMessage,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error in Ollama chat completion:', error);
    throw new Error(error.message || 'Failed to get response from Ollama');
  }
}

/**
 * Streams a chat completion response using Ollama.
 * @param {string} userMessage - The user's input message.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 * @param {string} model - The Ollama model to use (e.g., 'llama2', 'mistral', etc.)
 */
export async function getStreamingChatCompletion(userMessage, onChunk, model = 'llama2') {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: userMessage,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(Boolean);
      
      for (const line of lines) {
        const data = JSON.parse(line);
        onChunk(data.response);
      }
    }
  } catch (error) {
    console.error('Error in Ollama streaming chat:', error);
    throw new Error(error.message || 'Failed to stream response from Ollama');
  }
}

/**
 * Lists available models from Ollama.
 * @returns {Promise<Array>} List of available models.
 */
export async function listModels() {
  try {
    const isRunning = await checkOllamaConnection();
    if (!isRunning) {
      throw new Error(
        'Cannot connect to Ollama. Please make sure:\n' +
        '1. Ollama is installed\n' +
        '2. Ollama service is running\n' +
        '3. You can access http://localhost:11434'
      );
    }

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.models || data.models.length === 0) {
      throw new Error(
        'No Ollama models found. Please install at least one model using:\n' +
        'ollama pull modelname\n' +
        'Example: ollama pull llama2'
      );
    }
    return data.models || [];
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    throw new Error(error.message || 'Failed to fetch Ollama models');
  }
}
