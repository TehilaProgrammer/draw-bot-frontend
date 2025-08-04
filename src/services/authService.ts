import axios from 'axios';
import type { RegisterUserDto, LoginUserDto, User, ApiResponse } from '../types/models';

const API_BASE_URL = 'http://localhost:5227/api'; // Changed to correct HTTP port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Add timeout
});

export const authService = {
  // Register new user
  async register(userData: RegisterUserDto): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/auth/register', userData);
    return response.data.data!;
  },

  // Login user
  async login(credentials: LoginUserDto): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials);
    return response.data.data!;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  // Logout user
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};