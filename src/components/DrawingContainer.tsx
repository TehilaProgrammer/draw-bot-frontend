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
import AIPromptInput from './AIPromptInput';
import DrawingControls from './DrawingControls';
import { aiService } from '../services/aiService';
import { drawingService } from '../services/drawingService';
import { LocalDrawingService } from '../services/localDrawingService';
import type { DrawingCommand, DrawCommand } from '../types/models';

const DrawingContainer: React.FC = () => {
  const canvasRef = useRef<DrawingCanvasRef>(null);
  const [currentDrawCommands, setCurrentDrawCommands] = useState<DrawCommand[]>([]);
  const [commandHistory, setCommandHistory] = useState<DrawCommand[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState('');
  const [currentDrawingId, setCurrentDrawingId] = useState<number | null>(null);
  const [currentUserId] = useState<number>(2); 
  const [useLocalService, setUseLocalService] = useState(true); 

  const addToHistory = useCallback((commands: DrawCommand[]) => {
    const newHistory = commandHistory.slice(0, historyIndex + 1);
    newHistory.push([...commands]);
    setCommandHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [commandHistory, historyIndex]);

  const handleGenerateDrawing = async (prompt: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      let commands: DrawCommand[];
      
      if (useLocalService) {
        commands = LocalDrawingService.generateDrawingFromPrompt(prompt);
      } else {
        const defaultTitle = `Drawing: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`;
        commands = await aiService.generateDrawingCommands(currentUserId, prompt, defaultTitle);
      }
      
      setCurrentDrawCommands(commands);
      addToHistory(commands);
      
      setSuccessMessage('Drawing generated successfully!');
    } catch (err) {
      setError('Error generating drawing. Please try again.');
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

  const handleSave = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!drawingTitle.trim()) return;
    
    setIsLoading(true);
    try {
      if (useLocalService) {
        LocalDrawingService.saveDrawingLocally(drawingTitle, currentDrawCommands);
        setSuccessMessage('Drawing saved locally!');
      } else {
        if (currentDrawingId) {
          await drawingService.updateDrawingTitle(currentDrawingId, drawingTitle);
          for (const command of currentDrawCommands) {
            const drawingCommand: DrawingCommand = {
              drawingCommandId: 0,
              drawingId: currentDrawingId,
              commandType: command.type.toUpperCase(),
              parameters: JSON.stringify(command),
              order: 0,
            };
            await drawingService.addCommand(currentDrawingId, drawingCommand);
          }
        } else {
          const newDrawing = await drawingService.createDrawing({
            userId: currentUserId,
            title: drawingTitle,
          });
          setCurrentDrawingId(newDrawing.drawingId);
          
          for (let i = 0; i < currentDrawCommands.length; i++) {
            const command = currentDrawCommands[i];
            const drawingCommand: DrawingCommand = {
              drawingCommandId: 0,
              drawingId: newDrawing.drawingId,
              commandType: command.type.toUpperCase(),
              parameters: JSON.stringify(command),
              order: i,
            };
            await drawingService.addCommand(newDrawing.drawingId, drawingCommand);
          }
        }
        setSuccessMessage('Drawing saved successfully!');
      }
      
      setSaveDialogOpen(false);
      setDrawingTitle('');
    } catch (err) {
      setError('Error saving drawing');
      console.error('Error saving drawing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    setError('Load drawing functionality will be added soon');
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

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box 
        sx={{ 
          width: '25%',
          minWidth: '320px',
          maxWidth: '400px',
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
            Smart Drawing Bot
          </Typography>
        </Box>

        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
            {useLocalService ? 'Local Demo Mode' : 'AI Service'}
          </Typography>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={() => setUseLocalService(!useLocalService)}
          >
            Switch to {useLocalService ? 'AI Service' : 'Local Demo'}
          </Button>
        </Box>

        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <AIPromptInput
            onGenerate={handleGenerateDrawing}
            isLoading={isLoading}
            error={error}
          />
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
            onLoad={handleLoad}
            onDownload={handleDownload}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < commandHistory.length - 1}
            isLoading={isLoading}
          />
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Enter instructions in natural language and get automatic drawings
          </Typography>
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
            width={Math.min(800, window.innerWidth * 0.7)}
            height={Math.min(600, window.innerHeight * 0.7)}
          />
        </Box>
      </Box>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Drawing</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Drawing Title"
            fullWidth
            variant="outlined"
            value={drawingTitle}
            onChange={(e) => setDrawingTitle(e.target.value)}
            placeholder="Enter drawing title"
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

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DrawingContainer;