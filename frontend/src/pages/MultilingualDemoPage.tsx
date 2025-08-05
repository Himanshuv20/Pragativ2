import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import {
  WbSunny as WeatherIcon,
  Grass as CropIcon,
  TrendingUp as MarketIcon,
  Nature as SustainableIcon,
  RecordVoiceOver as SpeakIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const MultilingualDemoPage: React.FC = () => {
  const { t, currentLanguage, availableLanguages } = useLanguage();

  const features = [
    {
      icon: <WeatherIcon color="primary" sx={{ fontSize: 40 }} />,
      title: t('common.weatherInfo') || 'Weather Information',
      description: t('weather.forecast') || 'Weather forecast'
    },
    {
      icon: <CropIcon color="success" sx={{ fontSize: 40 }} />,
      title: t('common.cropRecommendation') || 'Crop Recommendations',
      description: t('cropCalendar.cropRecommendations') || 'Crop recommendations'
    },
    {
      icon: <MarketIcon color="secondary" sx={{ fontSize: 40 }} />,
      title: t('common.marketPrices') || 'Market Prices',
      description: t('mandiData.marketTrends') || 'Market trends'
    },
    {
      icon: <SustainableIcon color="success" sx={{ fontSize: 40 }} />,
      title: t('common.sustainablePractices') || 'Sustainable Practices',
      description: t('nav.sustainablePractices') || 'Sustainable practices'
    }
  ];

  const sampleTexts = [
    t('home.heroTitle') || 'Transform Your Farming with Smart Technology',
    t('home.heroSubtitle') || 'Get personalized crop calendars, real-time weather updates, and AI-powered agricultural insights',
    t('home.joinThousands') || 'Join thousands of farmers using smart technology to boost their harvest and reduce costs'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          {t('home.title') || '🌱 AgriGuru'}
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t('home.subtitle') || 'Intelligent Agricultural Advisory'}
        </Typography>
        
        {/* Current Language Display */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<LanguageIcon />}
            label={`${t('nav.language') || 'Language'}: ${availableLanguages[currentLanguage] || 'English'}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Language Selector */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanguageIcon color="primary" />
          {t('common.chooseLanguage') || 'Choose Your Language'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {currentLanguage === 'en' 
            ? 'Experience our agricultural platform in your preferred language. Select from 12 Indian languages below:'
            : t('home.heroSubtitle') || 'Get personalized crop calendars, real-time weather updates, and AI-powered agricultural insights'
          }
        </Typography>
        <LanguageSelector compact={false} />
      </Paper>

      {/* Features Grid */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        {t('home.smartFarmingTools') || '🚀 Smart Farming Tools'}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sample Translated Content */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          📝 {currentLanguage === 'en' ? 'Sample Translated Content' : t('home.getStarted') || 'Sample Content'}
        </Typography>
        <Stack spacing={2}>
          {sampleTexts.map((text, index) => (
            <Box key={index} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body1">{text}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ textAlign: 'center' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<CropIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            {t('home.startSmartFarming') || 'Start Smart Farming'}
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<WeatherIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            {t('home.checkWeather') || 'Check Weather'}
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<SpeakIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            {t('common.speakNow') || 'Speak Now'}
          </Button>
        </Stack>
      </Box>

      {/* Translation Info */}
      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {t('translationPowered') || 'Translation powered by Google Translate'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
          {currentLanguage === 'en' 
            ? 'Supporting 12 Indian languages with real-time translation for agricultural content'
            : `${Object.keys(availableLanguages).length} ${t('nav.language') || 'languages'} ${t('common.chooseLanguage') || 'supported'}`
          }
        </Typography>
      </Box>
    </Container>
  );
};

export default MultilingualDemoPage;
