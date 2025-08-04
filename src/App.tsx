import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import DrawingContainer from "./components/DrawingContainer";
import Login from "./components/Login";
import Register from "./components/Register";
import { authService } from "./services/authService";
import { LocalAuthService } from "./services/localAuthService";
import type { User, RegisterUserDto, LoginUserDto } from "./types/models";
import './App.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localUser = LocalAuthService.getCurrentUser();
    setCurrentUser(localUser);
    setIsLoading(false);
  }, []);

  const handleLogin = async (credentials: LoginUserDto) => {
    setIsLoading(true);
    try {
      try {
        const result = await authService.login(credentials);
        const user = result.user;
        
        LocalAuthService.saveUserToLocal(user);
        setCurrentUser(user);
      } catch (serverError) {
        console.warn('Server login failed, trying local login:', serverError);
        const user = LocalAuthService.login(credentials);
        setCurrentUser(user);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterUserDto) => {
    setIsLoading(true);
    try {
      const user = await authService.register(userData);
      
      if (!user || !user.userId) {
        throw new Error('Invalid user data received from server');
      }
      
      LocalAuthService.saveUserToLocal(user);
      setCurrentUser(user);
      
      alert('User registered successfully on server!');
    } catch (error) {
      console.error('Server registration failed:', error);
      
      const useLocal = confirm(
        'Server registration failed. Would you like to register locally instead? ' +
        '(Note: This will only work on this device and won\'t sync with the server)'
      );
      
      if (useLocal) {
        try {
          const user = LocalAuthService.register(userData);
          setCurrentUser(user);
          alert('User registered locally successfully!');
        } catch (localError) {
          alert(localError instanceof Error ? localError.message : 'Local registration error');
        }
      } else {
        alert(error instanceof Error ? error.message : 'Registration error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Server logout failed:', error);
    }
    
    LocalAuthService.logout();
    setCurrentUser(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app-container">
          {authMode === 'login' ? (
            <Login 
              onLogin={handleLogin}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <Register 
              onRegister={handleRegister}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <header className="app-header">
          <h1>DrawBot - {currentUser.userName}</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>
        <Router>
          <Routes>
            <Route path="/" element={<DrawingContainer currentUser={currentUser} />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
