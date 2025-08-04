import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Person as UserIcon,
  SmartToy as BotIcon,
  Brush as DrawIcon,
} from '@mui/icons-material';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isDrawingCommand?: boolean;
}

interface ChatHistoryProps {
  messages: ChatMessage[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <Box 
      sx={{ 
        height: '100%',
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {messages.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary'
          }}
        >
          <BotIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body2" align="center">
            Start a new conversation
          </Typography>
          <Typography variant="caption" align="center" sx={{ mt: 1 }}>
            Write a drawing instruction and I'll start drawing
          </Typography>
        </Box>
      ) : (
        messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
              gap: 1,
              alignItems: 'flex-start',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: message.type === 'user' ? '#1976d2' : '#f50057',
                fontSize: '0.875rem',
              }}
            >
              {message.type === 'user' ? <UserIcon /> : <BotIcon />}
            </Avatar>
            
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: '75%',
                backgroundColor: message.type === 'user' ? '#e3f2fd' : '#fff',
                borderRadius: 2,
                borderTopRightRadius: message.type === 'user' ? 0.5 : 2,
                borderTopLeftRadius: message.type === 'user' ? 2 : 0.5,
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {message.content}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: '0.7rem' }}
                >
                  {message.timestamp.toLocaleTimeString('he-IL', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Typography>
                
                {message.isDrawingCommand && (
                  <Chip
                    icon={<DrawIcon sx={{ fontSize: 12 }} />}
                    label="Drawing"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      backgroundColor: '#e8f5e8',
                      color: '#2e7d32',
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ChatHistory;