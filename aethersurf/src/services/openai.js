import OpenAI from 'openai';

/**
 * Initializes the OpenAI client with the API key from environment variables.
 * @returns {OpenAI} Configured OpenAI client instance.
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

/**
 * Generates a chat completion response based on user input.
 * @param {string} userMessage - The user's input message.
 * @returns {Promise<string>} The assistant's response.
 */
export async function getChatCompletion(userMessage) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that provides detailed, accurate, and well-structured responses.' },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw new Error(error.message || 'Failed to get response from OpenAI');
  }
}

/**
 * Streams a chat completion response chunk by chunk.
 * @param {string} userMessage - The user's input message.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 */
export async function getStreamingChatCompletion(userMessage, onChunk) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that provides detailed, accurate, and well-structured responses.' },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        onChunk(content);
      }
    }
    return fullResponse;
  } catch (error) {
    console.error('Error in streaming chat completion:', error);
    throw new Error(error.message || 'Failed to get streaming response from OpenAI');
  }
}

export default openai;