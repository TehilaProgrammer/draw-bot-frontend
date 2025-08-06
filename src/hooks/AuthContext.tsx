import React, { createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import type { AuthUser, RegisterUserDto, LoginUserDto } from '../types/models';

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginUserDto) => Promise<void>;
  register: (userData: RegisterUserDto) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
