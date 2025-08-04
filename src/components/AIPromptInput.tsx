import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment,
} from '@mui/material';
import { 
  Send as SendIcon, 
  AutoAwesome as AIIcon,
  Create as CreateIcon 
} from '@mui/icons-material';

interface AIPromptInputProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const AIPromptInput: React.FC<AIPromptInputProps> = ({
  onGenerate,
  isLoading = false,
  error,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      await onGenerate(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2.5, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AIIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
            AI Drawing Instructions
          </Typography>
          <Chip 
            icon={<CreateIcon sx={{ fontSize: 14 }} />}
            label="Smart" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '0.7rem'
            }} 
          />
        </Box>
        
        <form onSubmit={handleSubmit}>
          <TextField
            multiline
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Example: Draw a yellow sun with rays, a house with red roof, a green tree..."
            variant="outlined"
            fullWidth
            disabled={isLoading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 1.5,
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiInputBase-input': {
                color: '#333',
                fontSize: '0.9rem',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(0,0,0,0.6)',
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreateIcon sx={{ color: 'rgba(0,0,0,0.5)', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            disabled={!prompt.trim() || isLoading}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            fullWidth
            sx={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              fontSize: '0.9rem'
            }}
          >
            {isLoading ? 'Generating...' : 'Create Drawing'}
          </Button>
        </form>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: 1.5,
            '& .MuiAlert-message': {
              fontSize: '0.85rem'
            }
          }}
        >
          {error}
        </Alert>
      )}

      <Paper 
        elevation={1} 
        sx={{ 
          p: 1.5, 
          backgroundColor: '#f8f9fa',
          borderRadius: 1.5,
          border: '1px solid #e9ecef'
        }}
      >
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block',
            lineHeight: 1.4,
            fontSize: '0.75rem'
          }}
        >
          <strong>Tip:</strong> Enter instructions in natural language. Try: "house", "sun", "tree", "flower", "heart", "star" or combine them!
        </Typography>
      </Paper>
    </Box>
  );
};

export default AIPromptInput;