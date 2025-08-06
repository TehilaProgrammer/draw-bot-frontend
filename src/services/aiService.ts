import axios from 'axios';
import type { GenerateDrawingDto, DrawCommand } from '../types/models';

const API_BASE_URL = 'https://localhost:7208/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, 
});

export const aiService = {
  async generateDrawingCommands(
    userId: number = 2,
    prompt: string,
    title: string = "default"
  ): Promise<DrawCommand[]> {
    try {
      console.log('Sending to API:', { userId, prompt, title });
      const response = await api.post('/ai/generate-drawing', {
        userId,
        prompt,
        title,
      } as GenerateDrawingDto);

      console.log('Response data:', response.data);
      
      const data = response.data;
      
      if (!data || !data.commands || !Array.isArray(data.commands)) {
        throw new Error('Invalid response format from server');
      }
      
      return data.commands.map((cmd: any) => {
        try {
          const parsed = JSON.parse(cmd.parameters);
          return {
            ...parsed,
            type: cmd.commandType.toLowerCase(),
          } as DrawCommand;
        } catch (parseError) {
          console.error('Error parsing command parameters:', cmd.parameters);
          throw new Error(`Invalid command parameters: ${cmd.parameters}`);
        }
      });
    } catch (error) {
      console.error('Error in generateDrawingCommands:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          throw new Error(`Server error (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          throw new Error('No response from server. Please check if the server is running.');
        }
      }
      throw error;
    }
  },
};