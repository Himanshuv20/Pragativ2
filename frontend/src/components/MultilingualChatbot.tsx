import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  Translate as TranslateIcon
} from '@mui/icons-material';
import axios from 'axios';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
  intent?: string;
  suggestions?: string[];
}

interface MultilingualChatbotProps {
  userId: string;
  onLanguageChange?: (language: string) => void;
}

const MultilingualChatbot: React.FC<MultilingualChatbotProps> = ({
  userId,
  onLanguageChange
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    translate,
    translateBatch,
    isLoading: translationLoading,
    currentLanguage,
    setLanguage,
    availableLanguages
  } = useTranslation(userId);

  useEffect(() => {
    // Initialize with welcome message
    initializeChat();
  }, [currentLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    const welcomeMessage = "Welcome to the Agricultural Assistant! I can help you with crop calendars, weather forecasts, market prices, soil analysis, and more. How can I assist you today?";
    
    try {
      const translatedWelcome = await translate(welcomeMessage);
      const suggestions = [
        'Crop calendar',
        'Weather forecast', 
        'Market prices',
        'Soil analysis',
        'Change language'
      ];
      const translatedSuggestions = await translateBatch(suggestions);

      setMessages([{
        id: Date.now().toString(),
        text: translatedWelcome,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage,
        suggestions: translatedSuggestions
      }]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setMessages([{
        id: Date.now().toString(),
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Crop calendar', 'Weather forecast', 'Market prices', 'Soil analysis']
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
        userId,
        message: inputMessage,
        language: currentLanguage
      });

      if (response.data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date(),
          language: currentLanguage,
          intent: response.data.intent,
          suggestions: response.data.suggestions
        };

        setMessages(prev => [...prev, botMessage]);

        // Handle language change if detected
        if (response.data.languageChanged) {
          setLanguage(response.data.language);
          onLanguageChange?.(response.data.language);
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      const errorText = await translate(
        "I'm sorry, I couldn't process your request right now. Please try again."
      );
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleLanguageChange = async (newLanguage: string) => {
    await setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
    setShowLanguageSelector(false);
    
    // Reinitialize chat with new language
    setTimeout(() => {
      initializeChat();
    }, 500);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BotIcon color="primary" />
          <Typography variant="h6" color="primary">
            Agricultural Assistant
          </Typography>
          <Chip 
            label={availableLanguages[currentLanguage] || 'English'} 
            size="small" 
            color="primary"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Translate to local language">
            <IconButton 
              color="primary" 
              disabled={translationLoading}
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              {translationLoading ? <CircularProgress size={20} /> : <TranslateIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Language Selector */}
      {showLanguageSelector && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <LanguageSelector
            userId={userId}
            onLanguageChange={handleLanguageChange}
            compact
          />
        </Box>
      )}

      {/* Messages */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: 1,
              maxWidth: '80%',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
            }}>
              <Avatar sx={{ 
                width: 32, 
                height: 32,
                bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main'
              }}>
                {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
              </Avatar>
              
              <Box>
                <Paper sx={{ 
                  p: 2,
                  bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                  color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary'
                }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                  </Typography>
                  
                  {message.intent && (
                    <Typography variant="caption" sx={{ 
                      display: 'block', 
                      mt: 1, 
                      opacity: 0.7,
                      fontStyle: 'italic'
                    }}>
                      Intent: {message.intent}
                    </Typography>
                  )}
                </Paper>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {message.suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        size="small"
                        variant="outlined"
                        clickable
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                )}

                <Typography variant="caption" sx={{ 
                  display: 'block', 
                  mt: 0.5, 
                  opacity: 0.6,
                  textAlign: message.sender === 'user' ? 'right' : 'left'
                }}>
                  {message.timestamp.toLocaleTimeString()}
                  {message.language && message.language !== 'en' && (
                    <LanguageIcon sx={{ ml: 0.5, fontSize: 12 }} />
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                <BotIcon />
              </Avatar>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 1, display: 'inline' }}>
                  Thinking...
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentLanguage === 'en' 
              ? "Ask about farming, crops, weather..." 
              : "खेती, फसल, मौसम के बारे में पूछें..."
            }
            disabled={isLoading}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'grey.300' }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        
        {currentLanguage !== 'en' && (
          <Typography variant="caption" sx={{ 
            display: 'block', 
            mt: 1, 
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            🌐 Powered by IndicTrans2 for accurate agricultural translations
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MultilingualChatbot;
