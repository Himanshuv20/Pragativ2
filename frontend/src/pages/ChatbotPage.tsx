import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Fab,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  ArrowBack as BackIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { designTokens } from '../theme/theme';
import axios from 'axios';
import MultilingualChatbot from '../components/MultilingualChatbot';
import LanguageSelector from '../components/LanguageSelector';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

const ChatbotPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI agricultural assistant. How can I help you with your farming needs today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      // Add typing indicator
      const typingMessage: Message = {
        id: 'typing',
        text: 'AI Assistant is typing...',
        sender: 'bot',
        timestamp: new Date(),
        typing: true
      };
      setMessages(prev => [...prev, typingMessage]);

      const response = await axios.post('http://localhost:5000/api/chatbot/message', {
        message: userMessage.text,
        userId: 'user123',
        context: {
          location: null,
          previousMessages: messages.slice(-5) // Send last 5 messages for context
        }
      });

      // Remove typing indicator and add bot response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          text: response.data.response || 'I apologize, but I couldn\'t process your request right now.',
          sender: 'bot',
          timestamp: new Date()
        }];
      });

    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to send message. Please try again.');
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'Hello! I\'m your AI agricultural assistant. How can I help you with your farming needs today?',
      sender: 'bot',
      timestamp: new Date()
    }]);
    setError(null);
  };

  const quickQuestions = [
    'What crops should I plant this season?',
    'How do I identify plant diseases?',
    'What are the current market prices?',
    'Weather forecast for farming',
    'Soil health improvement tips',
    'Government farming schemes'
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, 
        ${designTokens.colors.primary[50]} 0%, 
        ${designTokens.colors.secondary[50]} 50%, 
        ${designTokens.colors.primary[100]} 100%)`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: designTokens.borderRadius.lg,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
                <BackIcon />
              </IconButton>
              <Avatar sx={{ bgcolor: designTokens.colors.primary[500], mr: 2 }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  AI Agricultural Assistant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your smart farming companion
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton onClick={clearChat} title="Clear chat">
                <ClearIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: designTokens.borderRadius.lg,
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Quick questions to get started:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {quickQuestions.map((question, index) => (
                <Chip
                  key={index}
                  label={question}
                  variant="outlined"
                  size="small"
                  onClick={() => setInputText(question)}
                  sx={{
                    '&:hover': {
                      backgroundColor: designTokens.colors.primary[50],
                      borderColor: designTokens.colors.primary[500],
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* Messages Area */}
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: designTokens.borderRadius.lg,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 1,
              maxHeight: 'calc(100vh - 300px)',
            }}
          >
            <List sx={{ p: 0 }}>
              {messages.map((message, index) => (
                <ListItem
                  key={message.id}
                  sx={{
                    flexDirection: 'column',
                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    pb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      maxWidth: '80%',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: message.sender === 'user' 
                          ? designTokens.colors.primary[500] 
                          : designTokens.colors.secondary[500],
                        width: 32,
                        height: 32,
                        mx: 1,
                      }}
                    >
                      {message.sender === 'user' ? <UserIcon /> : <BotIcon />}
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: designTokens.borderRadius.md,
                        backgroundColor: message.sender === 'user' 
                          ? designTokens.colors.primary[500]
                          : 'rgba(255, 255, 255, 0.9)',
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                        opacity: message.typing ? 0.7 : 1,
                        animation: message.typing ? 'pulse 1.5s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 0.7 },
                          '50%': { opacity: 1 },
                        },
                      }}
                    >
                      <Typography variant="body2">
                        {message.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                          fontSize: '0.7rem',
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ m: 1 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Input Area */}
          <Divider />
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <TextField
              ref={inputRef}
              fullWidth
              variant="outlined"
              placeholder="Ask me anything about farming..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              multiline
              maxRows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: designTokens.borderRadius.md,
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              sx={{
                bgcolor: designTokens.colors.primary[500],
                color: 'white',
                '&:hover': {
                  bgcolor: designTokens.colors.primary[600],
                },
                '&:disabled': {
                  bgcolor: designTokens.colors.neutral[300],
                },
              }}
            >
              {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatbotPage;
