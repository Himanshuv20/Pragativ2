import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Avatar,
  Chip,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Language as LanguageIcon, Check as CheckIcon, Public as PublicIcon } from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectorProps {
  userId?: string;
  onLanguageChange?: (language: string) => void;
  compact?: boolean;
  showIcon?: boolean;
  variant?: 'dropdown' | 'chip' | 'icon';
}

// Language flag emojis for visual enhancement
const languageFlags: Record<string, string> = {
  'en': '🇺🇸',
  'hi': '🇮🇳',
  'mr': '🇮🇳',
  'te': '🇮🇳',
  'pa': '🇮🇳',
  'gu': '🇮🇳',
  'ta': '🇮🇳',
  'kn': '🇮🇳',
  'bn': '🇧🇩',
  'ml': '🇮🇳',
  'as': '🇮🇳',
  'ur': '🇵🇰'
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  userId,
  onLanguageChange,
  compact = false,
  showIcon = true,
  variant = 'dropdown'
}) => {
  const { currentLanguage, availableLanguages, changeLanguage, loading: contextLoading, t } = useLanguage();
  const [updating, setUpdating] = useState<boolean>(false);

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === currentLanguage) return;

    try {
      setUpdating(true);
      await changeLanguage(newLanguage);
      onLanguageChange?.(newLanguage);
      
      // Show success feedback
      console.log(`Language changed to: ${availableLanguages[newLanguage]}`);
    } catch (error) {
      console.error('Error updating language:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getCurrentLanguageDisplay = () => {
    const flag = languageFlags[currentLanguage] || '🌐';
    const name = availableLanguages[currentLanguage] || 'English';
    return { flag, name };
  };

  // Chip variant - shows current language as a chip
  if (variant === 'chip') {
    const { flag, name } = getCurrentLanguageDisplay();
    return (
      <Chip
        avatar={<Avatar sx={{ bgcolor: 'transparent' }}>{flag}</Avatar>}
        label={compact ? currentLanguage.toUpperCase() : name}
        onClick={() => {}} // You can implement a popup here
        color="primary"
        variant="outlined"
        size={compact ? "small" : "medium"}
        disabled={updating}
      />
    );
  }

  // Icon variant - just the globe icon
  if (variant === 'icon') {
    return (
      <Tooltip title={t('common.chooseLanguage') || 'Choose Language'}>
        <IconButton 
          color="primary" 
          size={compact ? "small" : "medium"}
          disabled={updating}
        >
          {updating ? <CircularProgress size={20} /> : <PublicIcon />}
        </IconButton>
      </Tooltip>
    );
  }

  // Compact dropdown variant
  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showIcon && (
          <Tooltip title={t('common.chooseLanguage') || 'Choose Language'}>
            <IconButton size="small" color="primary">
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        )}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={contextLoading || updating}
            sx={{ fontSize: '0.875rem' }}
            displayEmpty
          >
            {Object.entries(availableLanguages).map(([code, name]) => (
              <MenuItem key={code} value={code}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <span style={{ fontSize: '1.2em' }}>{languageFlags[code] || '🌐'}</span>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {name}
                  </Typography>
                  {updating && currentLanguage === code && (
                    <CircularProgress size={16} />
                  )}
                  {!updating && currentLanguage === code && (
                    <CheckIcon fontSize="small" color="success" />
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  // Full dropdown variant
  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LanguageIcon color="primary" />
        <Typography variant="h6" color="primary">
          {t('nav.language') || 'Language Preference'}
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('common.chooseLanguage') || 'Select your preferred language for the agricultural assistant'}
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="language-select-label">
          {t('common.chooseLanguage') || 'Choose Language'}
        </InputLabel>
        <Select
          labelId="language-select-label"
          value={currentLanguage}
          label={t('common.chooseLanguage') || 'Choose Language'}
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={contextLoading || updating}
        >
          {Object.entries(availableLanguages).map(([code, name]) => (
            <MenuItem key={code} value={code}>
              <ListItemIcon>
                <span style={{ fontSize: '1.5em' }}>{languageFlags[code] || '🌐'}</span>
              </ListItemIcon>
              <ListItemText 
                primary={name}
                secondary={code.toUpperCase()}
              />
              {updating && currentLanguage === code && (
                <CircularProgress size={20} sx={{ ml: 1 }} />
              )}
              {!updating && currentLanguage === code && (
                <CheckIcon color="success" sx={{ ml: 1 }} />
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Translation powered by notice */}
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PublicIcon sx={{ fontSize: 14 }} />
          {t('translationPowered') || 'Translation powered by Google Translate'}
        </Typography>
      </Box>
    </Box>
  );
};

export default LanguageSelector;

