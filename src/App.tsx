import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import DrawingContainer from "./components/DrawingContainer";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuthContext } from './hooks/AuthContext';
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
  const { currentUser, isLoading, logout } = useAuthContext();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <Register 
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
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </header>
        <Router>
          <Routes>
            <Route path="/" element={<DrawingContainer />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
