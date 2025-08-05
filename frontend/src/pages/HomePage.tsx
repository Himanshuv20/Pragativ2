import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  useTheme, 
  useMediaQuery,
  Card,
  CardContent,
  Fade,
  Grow,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ActionTile from '../components/ActionTile';
import SOSButton from '../components/SOSButton';
import { CropCalendarAPI } from '../services/api';
import { designTokens } from '../theme/theme';
import { AppIcons } from '../components/icons/AppIcons';
import { PestDiseaseIcon } from '../components/icons/AppIcons_clean';
import { 
  Agriculture as AgricultureIcon,
  WbSunny as WeatherSunnyIcon,
  Nature as SustainableIcon,
  LocalHospital as EmergencyIcon,
  Event as CropCalendarIcon,
  AccountBalance as GovernmentIcon,
  Store as MandiIcon
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useLanguage();

  const handleSOSEmergency = async (emergencyData: any) => {
    try {
      console.log('SOS Emergency Data:', emergencyData);
      const response = await CropCalendarAPI.submitSOSEmergency(emergencyData);
      console.log('Emergency submitted successfully:', response);
      
      alert(`Emergency request submitted! 
      Ticket #: ${response.ticketNumber}
      Estimated response time: ${response.estimatedResponseTime}
      
      Emergency responders have been notified.`);
      
    } catch (error) {
      console.error('Failed to submit emergency:', error);
      alert('Failed to submit emergency request. Please try again or call 911 for immediate assistance.');
    }
  };

  const modules = [
    {
      title: t('modules.cropCalendar.title'),
      subtitle: t('modules.cropCalendar.subtitle'),
      icon: <CropCalendarIcon sx={{ fontSize: 'inherit' }} />,
      path: '/crop-calendar',
      color: 'primary' as const,
      size: 'lg' as const
    },
    {
      title: t('modules.weather.title'),
      subtitle: t('modules.weather.subtitle'),
      icon: <WeatherSunnyIcon sx={{ fontSize: 'inherit' }} />,
      path: '/weather',
      color: 'info' as const,
      size: 'md' as const
    },
    {
      title: t('modules.mandiData.title'),
      subtitle: t('modules.mandiData.subtitle'),
      icon: <MandiIcon sx={{ fontSize: 'inherit' }} />,
      path: '/mandi-data',
      color: 'success' as const,
      size: 'md' as const,
      badge: t('common.live')
    },
    {
      title: t('modules.governmentSchemes.title'),
      subtitle: t('modules.governmentSchemes.subtitle'),
      icon: <GovernmentIcon sx={{ fontSize: 'inherit' }} />,
      path: '/government-schemes',
      color: 'government' as const,
      size: 'md' as const
    },
    {
      title: t('modules.soilAnalysis.title'),
      subtitle: t('modules.soilAnalysis.subtitle'),
      icon: <AppIcons.SoilAnalysis sx={{ fontSize: 'inherit' }} />,
      path: '/soil-analysis',
      color: 'satellite' as const,
      size: 'lg' as const,
      badge: t('common.new')
    },
    {
      title: t('modules.pestDisease.title'),
      subtitle: t('modules.pestDisease.subtitle'),
      icon: <PestDiseaseIcon sx={{ fontSize: 'inherit' }} />,
      path: '/pest-disease-analysis',
      color: 'warning' as const,
      size: 'lg' as const,
      badge: 'AI'
    },
    {
      title: t('modules.soilTestBooking.title'),
      subtitle: t('modules.soilTestBooking.subtitle'),
      icon: <AppIcons.SoilAnalysis sx={{ fontSize: 'inherit' }} />,
      path: '/soil-test-booking',
      color: 'earth' as const,
      size: 'md' as const,
      badge: 'BOOK'
    },
    {
      title: t('modules.sustainablePractices.title'),
      subtitle: t('modules.sustainablePractices.subtitle'),
      icon: <SustainableIcon sx={{ fontSize: 'inherit' }} />,
      path: '/sustainable-practices',
      color: 'earth' as const,
      size: 'md' as const
    },
    {
      title: t('modules.debtCounseling.title'),
      subtitle: t('modules.debtCounseling.subtitle'),
      icon: <AppIcons.DebtCounseling sx={{ fontSize: 'inherit' }} />,
      path: '/debt-counseling',
      color: 'finance' as const,
      size: 'md' as const
    },
    {
      title: t('modules.sosEmergency.title'),
      subtitle: t('modules.sosEmergency.subtitle'),
      icon: <EmergencyIcon sx={{ fontSize: 'inherit' }} />,
      path: '/sos-emergency',
      color: 'emergency' as const,
      size: 'md' as const,
      badge: '24/7'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, 
        ${designTokens.colors.primary[50]} 0%, 
        ${designTokens.colors.earth[50]} 30%, 
        ${designTokens.colors.primary[100]} 70%, 
        ${designTokens.colors.earth[100]} 100%)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23${designTokens.colors.primary[500].replace('#', '')}' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          zIndex: 0,
        }}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1.5, sm: 2, md: 3 },
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
      >
        {/* Hero Section with Agricultural Imagery */}
        <Fade in timeout={1000}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 3, sm: 4, md: 5 },
            px: { xs: 0.5, sm: 1 },
            position: 'relative'
          }}>
            {/* Decorative Agriculture Icons */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -15, sm: -20, md: -30 },
                left: { xs: '5%', sm: '10%', md: '15%' },
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <AgricultureIcon 
                sx={{ 
                  fontSize: { sm: 32, md: 48 }, 
                  color: designTokens.colors.earth[300],
                  opacity: 0.7
                }} 
              />
            </Box>
            
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -10, sm: -15, md: -25 },
                right: { xs: '5%', sm: '15%', md: '20%' },
                animation: 'float 3s ease-in-out infinite 1.5s',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <WeatherSunnyIcon 
                sx={{ 
                  fontSize: { sm: 28, md: 40 }, 
                  color: '#FFA726',
                  opacity: 0.6
                }} 
              />
            </Box>
          </Box>
        </Fade>

        {/* Enhanced Modules Grid with Agricultural Theme */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)', 
                  md: 'repeat(5, 1fr)',
                },
                gap: { xs: 1.5, sm: 2, md: 2.5 },
                justifyItems: 'center',
                maxWidth: '100%',
                mx: 'auto',
                px: { xs: 0.5, sm: 0 },
              }}
            >
              {modules.map((module, index) => (
                <Grow in timeout={1000 + index * 200} key={module.title}>
                  <Box sx={{ 
                    width: '100%', 
                    maxWidth: { xs: 150, sm: 140, md: 160 },
                    minWidth: { xs: 130, sm: 120, md: 140 },
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                    <ActionTile
                      title={module.title}
                      subtitle={module.subtitle}
                      icon={module.icon}
                      color={module.color}
                      size={isMobile ? 'sm' : module.size}
                      onClick={() => navigate(module.path)}
                      badge={module.badge}
                    />
                  </Box>
                </Grow>
              ))}
            </Box>
          </Box>
        </Fade>

        {/* SOS Emergency FAB - Fixed Position */}
        <SOSButton onEmergencySubmit={handleSOSEmergency} />
      </Container>
    </Box>
  );
};

export default HomePage;
