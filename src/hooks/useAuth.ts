import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { LocalAuthService } from '../services/localAuthService';
import type { AuthUser, RegisterUserDto, LoginUserDto } from '../types/models';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localUser = LocalAuthService.getCurrentUser();
    setCurrentUser(localUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginUserDto) => {
    setIsLoading(true);
    try {
      try {
        const result = await authService.login(credentials);
        const userFromServer = (result && typeof result === 'object' && 'userId' in result)
          ? result
          : (result && typeof result === 'object' && 'user' in result ? result.user : undefined);
        if (!userFromServer || !userFromServer.userId) {
          throw new Error('User object or userId is undefined');
        }
        const authUser: AuthUser = {
          userId: Number(userFromServer.userId),
          userName: 'userName' in userFromServer ? userFromServer.userName : userFromServer.user.userName,
          email: 'email' in userFromServer ? userFromServer.email : userFromServer.user.email,
        };
        LocalAuthService.saveUserToLocal(authUser);
        setCurrentUser(authUser);
      } catch (serverError) {
        const user = LocalAuthService.login(credentials);
        setCurrentUser(user);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterUserDto) => {
    setIsLoading(true);
    try {
      const user = await authService.register(userData);
      if (!user || !user.userId) {
        throw new Error('Invalid user data received from server');
      }
      const authUser: AuthUser = {
        userId: user.userId,
        userName: user.userName,
        email: user.email,
      };
      LocalAuthService.saveUserToLocal(authUser);
      setCurrentUser(authUser);
      return { success: true, server: true };
    } catch (error) {
      const useLocal = window.confirm(
        'Server registration failed. Would you like to register locally instead? ' +
        '(Note: This will only work on this device and won\'t sync with the server)'
      );
      if (useLocal) {
        try {
          const user = LocalAuthService.register(userData);
          setCurrentUser(user);
          return { success: true, server: false };
        } catch (localError) {
          throw localError;
        }
      } else {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    LocalAuthService.logout();
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    setCurrentUser,
  };
}
