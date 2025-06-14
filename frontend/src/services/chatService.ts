import api from '../axiosConfig';
import { ChatMessage } from '../types';

/**
 * A service for interacting with the backend chat API.
 */
const chatService = {
  /**
   * Fetches the full chat history for the currently authenticated user.
   */
  async getHistory(): Promise<ChatMessage[]> {
    const response = await api.get<ChatMessage[]>('/chat/history');
    return response.data;
  },

  /**
   * Sends a new message to the backend and receives the AI's response.
   * The backend is expected to return the full, updated chat history.
   *
   * @param messageText The text of the user's message.
   */
  async sendMessage(messageText: string): Promise<ChatMessage> {
    const response = await api.post<ChatMessage>('/chat/messages', { text: messageText });
    return response.data;
  }
};

export default chatService;
