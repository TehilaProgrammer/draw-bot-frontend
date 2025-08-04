import axios from 'axios';
import type { Drawing, CreateDrawingDto, DrawingCommandDto, ApiResponse } from '../types/models';

const API_BASE_URL = 'https://localhost:7208/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, 
});

export const drawingService = {
  async createDrawing(drawingData: CreateDrawingDto): Promise<Drawing> {
    try {
      console.log('Creating drawing:', drawingData);
      const response = await api.post<ApiResponse<Drawing>>('/drawing', drawingData);
      console.log('Drawing creation response:', response.data);
      return response.data.data!;
    } catch (error) {
      console.error('Drawing creation error:', error);
      throw error;
    }
  },

  async getDrawing(drawingId: number): Promise<Drawing> {
    const response = await api.get<ApiResponse<Drawing>>(`/drawing/${drawingId}`);
    return response.data.data!;
  },

  async getUserDrawings(userId: number): Promise<Drawing[]> {
    const response = await api.get<ApiResponse<Drawing[]>>(`/drawing/user/${userId}`);
    return response.data.data!;
  },

  async addCommand(drawingId: number, command: DrawingCommandDto): Promise<void> {
    await api.post(`/drawing/${drawingId}/command`, command);
  },

  async deleteCommand(commandId: number): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/drawing/command/${commandId}`);
    return response.data.data!;
  },

  async updateDrawingTitle(drawingId: number, title: string): Promise<void> {
    await api.put(`/drawing/${drawingId}`, { title });
  },

  async deleteDrawing(drawingId: number): Promise<void> {
    await api.delete(`/drawing/${drawingId}`);
  },
};
