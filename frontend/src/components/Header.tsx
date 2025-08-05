import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Agriculture, 
  Menu as MenuIcon, 
  Emergency,
  Person,
  Logout,
  Login,
  Language as LanguageIcon
} from '@mui/icons-material';
import { designTokens } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);
  
  const { farmer, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: `linear-gradient(135deg, ${designTokens.colors.primary[600]} 0%, ${designTokens.colors.primary[700]} 50%, ${designTokens.colors.primary[800]} 100%)`,
        borderBottom: `1px solid ${designTokens.colors.primary[500]}`,
        boxShadow: designTokens.shadows.sm,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0, py: designTokens.spacing[2] }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: designTokens.spacing[1], sm: designTokens.spacing[2] },
                p: { xs: designTokens.spacing[1], sm: designTokens.spacing[2] },
                borderRadius: designTokens.borderRadius.lg,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Agriculture sx={{ fontSize: { xs: 24, sm: 32 }, color: designTokens.colors.primary[200] }} />
              <Box>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: designTokens.typography.fontWeight.bold,
                    fontSize: { xs: designTokens.typography.fontSize.base, sm: designTokens.typography.fontSize.lg },
                    lineHeight: designTokens.typography.lineHeight.tight,
                    color: 'white',
                  }}
                >
                  🌱 {t('home.title', 'PRAGATI.ai')}
                </Typography>
                {/* Removed subtitle "Intelligent Agricultural Advisory" */}
              </Box>
            </Box>
          </Box>

          {/* Navigation */}
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
                    color: 'white',
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }
                  }
                }}
              >
                <MenuItem
                  component={Link}
                  to="/sos-emergency"
                  onClick={handleMenuClose}
                  sx={{
                    bgcolor: location.pathname === '/sos-emergency' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1.5,
                    color: '#FF5252'
                  }}
                >
                  <Emergency sx={{ fontSize: 20 }} />
                  {t('nav.sosEmergency', 'Emergency')}
                </MenuItem>
                
                {/* Language Selector Menu Item */}
                <MenuItem
                  onClick={() => {
                    setShowLanguageSelector(true);
                    handleMenuClose();
                  }}
                  sx={{
                    bgcolor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1.5
                  }}
                >
                  <LanguageIcon sx={{ fontSize: 20 }} />
                  {t('nav.language', 'Language')}
                </MenuItem>
                
                {/* Mobile Authentication Menu Items */}
                {isAuthenticated ? (
                  <>
                    <MenuItem sx={{ px: 3, py: 1.5, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {farmer?.firstName} {farmer?.lastName}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        {farmer?.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/profile');
                        handleMenuClose();
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 3,
                        py: 1.5
                      }}
                    >
                      <Person sx={{ fontSize: 20 }} />
                      {t('nav.profile', 'Profile')}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                        handleMenuClose();
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 3,
                        py: 1.5
                      }}
                    >
                      <Logout sx={{ fontSize: 20 }} />
                      {t('nav.logout', 'Logout')}
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleLogin();
                        handleMenuClose();
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 3,
                        py: 1.5
                      }}
                    >
                      <Login sx={{ fontSize: 20 }} />
                      {t('nav.login', 'Login')}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleRegister();
                        handleMenuClose();
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 3,
                        py: 1.5,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.2)'
                        }
                      }}
                    >
                      <Person sx={{ fontSize: 20 }} />
                      {t('nav.register', 'Register')}
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

              {/* Language Selector */}
              <IconButton
                onClick={() => setShowLanguageSelector(true)}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  ml: 1,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <LanguageIcon />
              </IconButton>

              {/* Authentication Section */}
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {isAuthenticated ? (
                  <>
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        p: 1,
                        '&:hover': { 
                          bgcolor: 'rgba(255,255,255,0.2)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: designTokens.colors.primary[400],
                        fontSize: '14px'
                      }}>
                        {farmer?.firstName?.[0]}{farmer?.lastName?.[0]}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={userMenuAnchorEl}
                      open={Boolean(userMenuAnchorEl)}
                      onClose={handleUserMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          background: 'rgba(255,255,255,0.95)',
                          backdropFilter: 'blur(10px)',
                          color: 'text.primary',
                          minWidth: 200,
                          '& .MuiMenuItem-root': {
                            '&:hover': {
                              bgcolor: 'rgba(25, 118, 210, 0.1)'
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem sx={{ px: 2, py: 1.5, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {farmer?.firstName} {farmer?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {farmer?.email}
                        </Typography>
                      </MenuItem>
                      <Divider />
                      <MenuItem 
                        onClick={() => {
                          navigate('/profile');
                          handleUserMenuClose();
                        }} 
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5 }}
                      >
                        <Person sx={{ fontSize: 20 }} />
                        {t('nav.profile', 'Profile')}
                      </MenuItem>
                      <MenuItem onClick={handleLogout} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5 }}>
                        <Logout sx={{ fontSize: 20 }} />
                        {t('nav.logout', 'Logout')}
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleLogin}
                      color="inherit"
                      startIcon={<Login />}
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        fontWeight: 600,
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': { 
                          bgcolor: 'rgba(255,255,255,0.15)',
                          border: '1px solid rgba(255,255,255,0.5)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('nav.login', 'Login')}
                    </Button>
                    <Button
                      onClick={handleRegister}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: designTokens.colors.primary[700],
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        fontWeight: 600,
                        '&:hover': { 
                          bgcolor: 'white',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('nav.register', 'Register')}
                    </Button>
                  </>
                )}
              </Box>
              <IconButton
                component={Link}
                to="/sos-emergency"
                size="small"
                sx={{
                  bgcolor: '#D32F2F',
                  color: 'white',
                  borderRadius: 2,
                  ml: 1,
                  '&:hover': { 
                    bgcolor: '#B71C1C',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Emergency sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
      
      {/* Language Selector Dialog */}
      <Dialog
        open={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pb: 1,
          background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <LanguageIcon />
            {t('language.selectLanguage', 'Select Language')}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <LanguageSelector
            userId={farmer?.id || 'guest'}
            onLanguageChange={(language) => {
              console.log('Language changed to:', language);
              setShowLanguageSelector(false);
            }}
            compact={false}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setShowLanguageSelector(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            {t('language.close', 'Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
