import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Fab,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  Feedback as FeedbackIcon,
  LocationOn as LocationIcon,
  Agriculture as AgricultureIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styled components
const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 180, // Position above Chatbot FAB (FAB at 100px + button height ~64px + spacing)
  right: 20, // Align with both buttons
  width: 400,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1300,
  boxShadow: theme.shadows[10],
  borderRadius: 16,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: '95vw',
    height: '80vh',
    bottom: 10,
    right: '2.5vw',
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  background: theme.palette.grey[50],
}));

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ theme, isUser }) => ({
  maxWidth: '80%',
  marginBottom: theme.spacing(1),
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  marginLeft: isUser ? 'auto' : 0,
  marginRight: isUser ? 0 : 'auto',
}));

const BubbleContent = styled(Paper)<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: isUser ? theme.palette.primary.main : 'white',
  color: isUser ? 'white' : theme.palette.text.primary,
  borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
  boxShadow: theme.shadows[1],
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
}));

const ChatFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 100, // Position above SOS button (SOS is at 16-24px, add button height + spacing)
  right: 20, // Align with SOS button right edge
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  zIndex: 999, // Lower z-index than SOS button (1000)
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  '& .dot': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.grey[400],
    margin: '0 2px',
    animation: 'typing 1.4s infinite',
    '&:nth-of-type(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '0.4s',
    },
  },
  '@keyframes typing': {
    '0%, 60%, 100%': {
      transform: 'translateY(0)',
    },
    '30%': {
      transform: 'translateY(-10px)',
    },
  },
}));

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  intent?: string;
  suggestions?: string[];
  data?: any;
}

interface ChatbotProps {
  userId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  onLocationRequest?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ 
  userId = 'anonymous', 
  location,
  onLocationRequest 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    messageId: string;
    rating: number;
    feedback: string;
  }>({
    open: false,
    messageId: '',
    rating: 0,
    feedback: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "Hello! I'm your agricultural assistant. I can help you with crop calendars, weather forecasts, market prices, soil analysis, and more. How can I assist you today?",
        isUser: false,
        timestamp: new Date(),
        suggestions: ['Show crop calendar', 'Weather forecast', 'Market prices', 'Soil analysis', 'Help with pests']
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = {
        location,
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post('http://localhost:5000/api/chatbot/message', {
        message,
        userId,
        context
      });

      const botMessage: Message = {
        id: response.data.conversationId || Date.now().toString(),
        text: response.data.response || 'I encountered an error processing your request.',
        isUser: false,
        timestamp: new Date(),
        intent: response.data.intent,
        suggestions: response.data.suggestions || [],
        data: response.data.data
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
        suggestions: ['Try again', 'Contact support']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const clearConversation = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/chatbot/conversation/${userId}`);
      setMessages([]);
      // Re-add welcome message
      const welcomeMessage: Message = {
        id: 'welcome-new',
        text: "Conversation cleared! How can I help you today?",
        isUser: false,
        timestamp: new Date(),
        suggestions: ['Show crop calendar', 'Weather forecast', 'Market prices', 'Soil analysis']
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Clear conversation error:', error);
    }
  };

  const handleFeedback = async () => {
    try {
      await axios.post('http://localhost:5000/api/chatbot/feedback', {
        userId,
        messageId: feedbackDialog.messageId,
        rating: feedbackDialog.rating,
        feedback: feedbackDialog.feedback
      });
      
      setFeedbackDialog({
        open: false,
        messageId: '',
        rating: 0,
        feedback: ''
      });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const renderMessage = (message: Message) => (
    <MessageBubble key={message.id} isUser={message.isUser}>
      <Box display="flex" alignItems="flex-start" gap={1}>
        {!message.isUser && (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <BotIcon fontSize="small" />
          </Avatar>
        )}
        <Box flex={1}>
          <BubbleContent isUser={message.isUser}>
            <Typography variant="body2">{message.text}</Typography>
          </BubbleContent>
          
          {/* Render suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <Box mt={1}>
              {message.suggestions.map((suggestion, index) => (
                <SuggestionChip
                  key={index}
                  label={suggestion}
                  size="small"
                  onClick={() => handleSuggestionClick(suggestion)}
                  clickable
                />
              ))}
            </Box>
          )}
          
          {/* Show location requirement */}
          {message.text.includes('location') && !location && (
            <Box mt={1}>
              <Button
                size="small"
                startIcon={<LocationIcon />}
                onClick={onLocationRequest}
                variant="outlined"
              >
                Enable Location
              </Button>
            </Box>
          )}
        </Box>
        
        {message.isUser && (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
        )}
      </Box>
      
      {/* Feedback option for bot messages */}
      {!message.isUser && message.id !== 'welcome' && (
        <Box display="flex" justifyContent="flex-end" mt={0.5}>
          <Tooltip title="Rate this response">
            <IconButton
              size="small"
              onClick={() => setFeedbackDialog({
                open: true,
                messageId: message.id,
                rating: 0,
                feedback: ''
              })}
            >
              <FeedbackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </MessageBubble>
  );

  return (
    <>
      {/* Chat FAB */}
      <ChatFab 
        onClick={() => setIsOpen(true)}
        sx={{
          width: { xs: 56, sm: 64 }, // Match SOS button size
          height: { xs: 56, sm: 64 }, // Match SOS button size
          fontSize: { xs: '1.5rem', sm: '1.75rem' }, // Match SOS button font size
        }}
      >
        <ChatIcon />
      </ChatFab>

      {/* Chat Window */}
      <Collapse in={isOpen}>
        <ChatContainer>
          {/* Header */}
          <ChatHeader>
            <Box display="flex" alignItems="center" gap={1}>
              <AgricultureIcon />
              <Typography variant="h6">AgriGuru Assistant</Typography>
            </Box>
            <Box>
              <Tooltip title="Clear conversation">
                <IconButton color="inherit" size="small" onClick={clearConversation}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close chat">
                <IconButton color="inherit" size="small" onClick={() => setIsOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </ChatHeader>

          {/* Messages */}
          <MessagesContainer>
            <List>
              {messages.map(renderMessage)}
              {isLoading && (
                <ListItem>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <BotIcon fontSize="small" />
                    </Avatar>
                    <TypingIndicator>
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </TypingIndicator>
                  </Box>
                </ListItem>
              )}
              <div ref={messagesEndRef} />
            </List>
          </MessagesContainer>

          <Divider />

          {/* Input */}
          <Box p={2}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask me anything about farming..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                disabled={isLoading}
                variant="outlined"
              />
              <IconButton
                color="primary"
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </ChatContainer>
      </Collapse>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialog.open}
        onClose={() => setFeedbackDialog(prev => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rate this response</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              How helpful was this response?
            </Typography>
            <Rating
              value={feedbackDialog.rating}
              onChange={(_, value) => setFeedbackDialog(prev => ({ ...prev, rating: value || 0 }))}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Any additional feedback? (optional)"
            value={feedbackDialog.feedback}
            onChange={(e) => setFeedbackDialog(prev => ({ ...prev, feedback: e.target.value }))}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(prev => ({ ...prev, open: false }))}>
            Cancel
          </Button>
          <Button onClick={handleFeedback} variant="contained">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chatbot;
