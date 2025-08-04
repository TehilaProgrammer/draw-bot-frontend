import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import { 
  Send as SendIcon, 
} from '@mui/icons-material';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
}) => {
  const [message, setMessage] = useState('');
  const [canSend, setCanSend] = useState(false);

  useEffect(() => {
    setCanSend(message.trim().length > 0 && !isLoading);
  }, [message, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canSend) {
      await onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        p: 2,
        borderTop: '1px solid #e0e0e0',
        backgroundColor: 'white',
        display: 'flex',
        gap: 1,
        alignItems: 'flex-end'
      }}
    >
      <TextField
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Write a drawing instruction..."
        variant="outlined"
        fullWidth
        disabled={isLoading}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: '#f8f9fa',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                type="submit"
                disabled={!canSend}
                sx={{
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: canSend ? '#1976d2' : '#e0e0e0',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: canSend ? '#1565c0' : '#e0e0e0',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                <SendIcon sx={{ fontSize: 20 }} />
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ChatInput;