import axios from 'axios';
import type { RegisterUserDto, LoginUserDto, User, ApiResponse } from '../types/models';

const API_BASE_URL = 'https://localhost:7208/api';

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
    try {
      const response = await api.post('/User/register', userData);
      
      if (!response || !response.data) {
        throw new Error('No response data from server');
      }
      
      const serverData = response.data;
      
      if (!serverData.userId || !serverData.userName || !serverData.email) {
        throw new Error('Invalid response from server: missing required fields');
      }
      
      const user: User = {
        userId: serverData.userId,
        userName: serverData.userName,
        email: serverData.email,
        password: userData.password,
        createdAt: new Date(),
        drawing: []
      };
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(credentials: LoginUserDto): Promise<{ user: User; token: string }> {
    try {
      console.log('Logging in user:', credentials.userName);
      const response = await api.post<ApiResponse<{ user: User; token: string }>>('/User/login', credentials);
      console.log('Login response:', response.data);
      return response.data.data!;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/User/me');
    return response.data.data!;
  },

  // Logout user
  async logout(): Promise<void> {
    await api.post('/User/logout');
  },
};