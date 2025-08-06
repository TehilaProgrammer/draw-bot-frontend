export interface User {
  userId: number;
  userName: string;
  password: string;
  email: string;
  createdAt?: Date;
  drawing: Drawing[];
}

export interface Drawing {
  drawingId: number;
  userId: number;
  title: string;
  createsAt: Date;
  updatesAt: Date;
  commands: DrawingCommand[];
}

export interface DrawingCommand {
  drawingCommandId: number;
  drawingId: number;
  commandType: string;
  parameters: string;
  order: number;
}

export interface DrawCommand {
  type: 'line' | 'circle' | 'rect' | 'triangle' | 'text' | 'clear';
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface CreateDrawingDto {
  userId: number;
  title: string;
}

export interface GenerateDrawingDto {
  userId: number;
  prompt: string;
  title?: string;
}

export interface DrawingCommandDto {
  commandType: string;
  parameters: string;
  order: number;
}

export interface RegisterUserDto {
  userName: string;
  password: string;
  email: string;
}

export interface LoginUserDto {
  userName: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
} 

export interface AuthUser {
  userId: number;
  userName: string;
  email: string;
}