import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  Chat as ChatIcon,
  SmartToy as BotIcon,
  ArrowBack as BackIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MultilingualChatbot from '../components/MultilingualChatbot';
import LanguageSelector from '../components/LanguageSelector';

const ChatbotPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Generate a simple user ID (in production, use actual authentication)
  const userId = 'user_' + Date.now().toString().slice(-6);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
        flexWrap: 'wrap'
      }}>
        <IconButton onClick={() => navigate('/')} color="primary">
          <BackIcon />
        </IconButton>
        
        <Typography variant="h4" color="primary" sx={{ flexGrow: 1 }}>
          AI Agricultural Assistant
        </Typography>
        
        <Button
          startIcon={<LanguageIcon />}
          variant="outlined"
          onClick={() => setShowLanguageDialog(true)}
          sx={{ minWidth: 'auto' }}
        >
          {currentLanguage === 'en' ? 'English' : 'भाषा'}
        </Button>
      </Box>

      {/* Feature Highlights */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          🌾 Get expert agricultural advice in your preferred Indian language using AI translation
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            icon={<ChatIcon />} 
            label="Multilingual Support" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<BotIcon />} 
            label="AI-Powered" 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            label="🌐 IndicTrans2" 
            color="success" 
            variant="outlined" 
          />
          <Chip 
            label="Real-time Data" 
            color="info" 
            variant="outlined" 
          />
        </Box>
      </Box>

      {/* Main Chatbot */}
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}
      >
        <MultilingualChatbot
          userId={userId}
          onLanguageChange={handleLanguageChange}
        />
      </Paper>

      {/* Language Selection Dialog */}
      <Dialog 
        open={showLanguageDialog} 
        onClose={() => setShowLanguageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon color="primary" />
            Select Your Language
          </Box>
        </DialogTitle>
        <DialogContent>
          <LanguageSelector
            userId={userId}
            onLanguageChange={(lang) => {
              handleLanguageChange(lang);
              setShowLanguageDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ChatbotPage;
