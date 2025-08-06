import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import DrawingCanvas from './DrawingCanvas';
import type { DrawingCanvasRef } from './DrawingCanvas';
import ChatHistory from './ChatHistory';
import type { ChatMessage } from './ChatHistory';
import ChatInput from './ChatInput';
import DrawingControls from './DrawingControls';
import { aiService } from '../services/aiService';
import type { DrawCommand } from '../types/models';
import { useAuthContext } from '../hooks/AuthContext';

const DrawingContainer: React.FC = () => {
  const { currentUser } = useAuthContext();
  const canvasRef = useRef<DrawingCanvasRef>(null);
  const [currentDrawCommands, setCurrentDrawCommands] = useState<DrawCommand[]>([]);
  const [commandHistory, setCommandHistory] = useState<DrawCommand[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newDrawingDialogOpen, setNewDrawingDialogOpen] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState('');
  const [currentDrawingId, setCurrentDrawingId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [userDrawings, setUserDrawings] = useState<any[]>([]);

  const addToHistory = useCallback((commands: DrawCommand[]) => {
    const newHistory = commandHistory.slice(0, historyIndex + 1);
    newHistory.push([...commands]);
    setCommandHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHasUnsavedChanges(true);
  }, [commandHistory, historyIndex]);

  const addChatMessage = useCallback((content: string, type: 'user' | 'bot', isDrawingCommand = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isDrawingCommand,
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, []);

  const loadUserDrawings = useCallback(() => {
    const drawings = JSON.parse(localStorage.getItem('localDrawings') || '[]')
      .filter((d: any) => d.userId === currentUser?.userId);
    setUserDrawings(drawings);
  }, [currentUser?.userId]);

  const handleSendMessage = async (message: string) => {
    addChatMessage(message, 'user', true);
    
    setIsLoading(true);
    setError('');
    
    try {
      const newCommands = await aiService.generateDrawingCommands(
        currentUser?.userId ?? 0, 
        message, 
        `Drawing-${Date.now()}`
      );
      
      const updatedCommands = [...currentDrawCommands, ...newCommands];
      setCurrentDrawCommands(updatedCommands);
      addToHistory(updatedCommands);
      
      addChatMessage('I added the drawing you requested!', 'bot');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating drawing. Please try again.';
      setError(errorMessage);
      addChatMessage('Sorry, there was an error creating the drawing. Please try again.', 'bot');
      console.error('Error generating drawing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentDrawCommands(commandHistory[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentDrawCommands(commandHistory[newIndex]);
    }
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    setCurrentDrawCommands([]);
    addToHistory([]);
  };

  const handleNewDrawing = () => {
    if (hasUnsavedChanges) {
      setNewDrawingDialogOpen(true);
    } else {
      startNewDrawing();
    }
  };

  const startNewDrawing = () => {
    canvasRef.current?.clear();
    setCurrentDrawCommands([]);
    setCommandHistory([]);
    setHistoryIndex(-1);
    setChatMessages([]);
    setCurrentDrawingId(null);
    setHasUnsavedChanges(false);
    setNewDrawingDialogOpen(false);
  };

  const handleSave = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!drawingTitle.trim()) return;
    
    setIsLoading(true);
    try {
      const drawings = JSON.parse(localStorage.getItem('localDrawings') || '[]');
      const newDrawing = {
        id: Date.now(),
        title: drawingTitle,
        commands: currentDrawCommands,
        userId: currentUser?.userId ?? 0,
        createdAt: new Date().toISOString()
      };

      drawings.push(newDrawing);
      localStorage.setItem('localDrawings', JSON.stringify(drawings));
      
      setSuccessMessage('Drawing saved successfully!');
      setHasUnsavedChanges(false);
      setSaveDialogOpen(false);
      setDrawingTitle('');
      loadUserDrawings();
    } catch (err) {
      setError('Error saving drawing');
      console.error('Error saving drawing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDrawing = (drawingId: number) => {
    const drawings = JSON.parse(localStorage.getItem('localDrawings') || '[]');
    const drawing = drawings.find((d: any) => d.id === drawingId);
    if (drawing) {
      setCurrentDrawCommands(drawing.commands);
      addToHistory(drawing.commands);
      setDrawingTitle(drawing.title);
      setCurrentDrawingId(drawing.id);
      setHasUnsavedChanges(false);
    }
  };

  const handleDeleteDrawing = (drawingId: number) => {
    if (confirm('Are you sure you want to delete this drawing?')) {
      const drawings = JSON.parse(localStorage.getItem('localDrawings') || '[]');
      const filteredDrawings = drawings.filter((d: any) => d.id !== drawingId);
      localStorage.setItem('localDrawings', JSON.stringify(filteredDrawings));
      
      loadUserDrawings();
      if (currentDrawingId === drawingId) {
        startNewDrawing();
      }
    }
  };

  const handleDownload = () => {
    const dataURL = canvasRef.current?.getDataURL();
    if (dataURL) {
      const link = document.createElement('a');
      link.download = `drawing-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  React.useEffect(() => {
    loadUserDrawings();
  }, [loadUserDrawings]);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      <Box 
        sx={{ 
          width: '300px',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            DrawBot
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Smart Drawing Robot
          </Typography>
        </Box>

        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleNewDrawing}
            sx={{ mb: 1 }}
          >
            New Drawing
          </Button>
        </Box>

        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Drawing Controls
          </Typography>
          <DrawingControls
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            onSave={handleSave}
            onLoad={() => {}}
            onDownload={handleDownload}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < commandHistory.length - 1}
            isLoading={isLoading}
          />
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            My Drawings
          </Typography>
          {userDrawings.map((drawing) => (
            <Box key={drawing.id} sx={{ mb: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {drawing.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(drawing.createdAt).toLocaleDateString('en-US')}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Button size="small" onClick={() => handleLoadDrawing(drawing.id)}>
                  Load
                </Button>
                <Button size="small" color="error" onClick={() => handleDeleteDrawing(drawing.id)}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          p: 3,
          overflow: 'auto'
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Drawing Canvas
          </Typography>
          
          <DrawingCanvas
            ref={canvasRef}
            drawCommands={currentDrawCommands}
            width={Math.min(800, window.innerWidth * 0.5)}
            height={Math.min(600, window.innerHeight * 0.7)}
          />
        </Box>
      </Box>

      <Box 
        sx={{ 
          width: '350px',
          backgroundColor: 'white',
          borderLeft: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Drawing Chat
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {hasUnsavedChanges && '• Unsaved changes'}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <ChatHistory messages={chatMessages} />
        </Box>

        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </Box>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Drawing</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Drawing Name"
            fullWidth
            variant="outlined"
            value={drawingTitle}
            onChange={(e) => setDrawingTitle(e.target.value)}
            placeholder="Enter drawing name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveConfirm} 
            variant="contained"
            disabled={!drawingTitle.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newDrawingDialogOpen} onClose={() => setNewDrawingDialogOpen(false)}>
        <DialogTitle>New Drawing</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Would you like to save the current drawing before starting a new one?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={startNewDrawing} color="error">
            Clear without saving
          </Button>
          <Button onClick={() => {
            setNewDrawingDialogOpen(false);
            setSaveDialogOpen(true);
          }} variant="contained">
            Save and start new
          </Button>
          <Button onClick={() => setNewDrawingDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DrawingContainer;