import React from 'react';
import { Box, Card, CardContent, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { designTokens } from '../theme/theme';

interface ActionTileProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'earth' | 'emergency' | 'finance' | 'government' | 'satellite';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  badge?: string | number;
}

const ActionTile: React.FC<ActionTileProps> = ({
  title,
  subtitle,
  icon,
  onClick,
  color = 'primary',
  size = 'md',
  disabled = false,
  badge,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Responsive tile sizing with enhanced dimensions
  const getTileSize = () => {
    if (isMobile) {
      switch (size) {
        case 'sm': return { width: 130, height: 140 };
        case 'lg': return { width: 150, height: 160 };
        default: return { width: 140, height: 150 };
      }
    }
    switch (size) {
      case 'sm': return { width: 140, height: 150 };
      case 'lg': return { width: 160, height: 170 };
      default: return { width: 150, height: 160 };
    }
  };

  // Enhanced color mapping with gradients and modern themes
  const getColorScheme = () => {
    const colorMap = {
      primary: {
        gradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%)',
        bg: 'rgba(76, 175, 80, 0.08)',
        hover: 'rgba(76, 175, 80, 0.15)',
        border: 'rgba(76, 175, 80, 0.3)',
        icon: '#2E7D32',
        text: '#1B5E20',
        shadow: 'rgba(76, 175, 80, 0.3)',
      },
      secondary: {
        gradient: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 50%, #64B5F6 100%)',
        bg: 'rgba(33, 150, 243, 0.08)',
        hover: 'rgba(33, 150, 243, 0.15)',
        border: 'rgba(33, 150, 243, 0.3)',
        icon: '#1565C0',
        text: '#0D47A1',
        shadow: 'rgba(33, 150, 243, 0.3)',
      },
      info: {
        gradient: 'linear-gradient(135deg, #00BCD4 0%, #26C6DA 50%, #4DD0E1 100%)',
        bg: 'rgba(0, 188, 212, 0.08)',
        hover: 'rgba(0, 188, 212, 0.15)',
        border: 'rgba(0, 188, 212, 0.3)',
        icon: '#00838F',
        text: '#006064',
        shadow: 'rgba(0, 188, 212, 0.3)',
      },
      warning: {
        gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 50%, #FFCC02 100%)',
        bg: 'rgba(255, 152, 0, 0.08)',
        hover: 'rgba(255, 152, 0, 0.15)',
        border: 'rgba(255, 152, 0, 0.3)',
        icon: '#E65100',
        text: '#BF360C',
        shadow: 'rgba(255, 152, 0, 0.3)',
      },
      success: {
        gradient: 'linear-gradient(135deg, #8BC34A 0%, #9CCC65 50%, #AED581 100%)',
        bg: 'rgba(139, 195, 74, 0.08)',
        hover: 'rgba(139, 195, 74, 0.15)',
        border: 'rgba(139, 195, 74, 0.3)',
        icon: '#558B2F',
        text: '#33691E',
        shadow: 'rgba(139, 195, 74, 0.3)',
      },
      earth: {
        gradient: 'linear-gradient(135deg, #795548 0%, #8D6E63 50%, #A1887F 100%)',
        bg: 'rgba(121, 85, 72, 0.08)',
        hover: 'rgba(121, 85, 72, 0.15)',
        border: 'rgba(121, 85, 72, 0.3)',
        icon: '#3E2723',
        text: '#1C0E0A',
        shadow: 'rgba(121, 85, 72, 0.3)',
      },
      emergency: {
        gradient: 'linear-gradient(135deg, #F44336 0%, #EF5350 50%, #E57373 100%)',
        bg: 'rgba(244, 67, 54, 0.08)',
        hover: 'rgba(244, 67, 54, 0.15)',
        border: 'rgba(244, 67, 54, 0.3)',
        icon: '#C62828',
        text: '#B71C1C',
        shadow: 'rgba(244, 67, 54, 0.3)',
      },
      finance: {
        gradient: 'linear-gradient(135deg, #9C27B0 0%, #AB47BC 50%, #BA68C8 100%)',
        bg: 'rgba(156, 39, 176, 0.08)',
        hover: 'rgba(156, 39, 176, 0.15)',
        border: 'rgba(156, 39, 176, 0.3)',
        icon: '#6A1B9A',
        text: '#4A148C',
        shadow: 'rgba(156, 39, 176, 0.3)',
      },
      government: {
        gradient: 'linear-gradient(135deg, #FF5722 0%, #FF7043 50%, #FF8A65 100%)',
        bg: 'rgba(255, 87, 34, 0.08)',
        hover: 'rgba(255, 87, 34, 0.15)',
        border: 'rgba(255, 87, 34, 0.3)',
        icon: '#D84315',
        text: '#BF360C',
        shadow: 'rgba(255, 87, 34, 0.3)',
      },
      satellite: {
        gradient: 'linear-gradient(135deg, #607D8B 0%, #78909C 50%, #90A4AE 100%)',
        bg: 'rgba(96, 125, 139, 0.08)',
        hover: 'rgba(96, 125, 139, 0.15)',
        border: 'rgba(96, 125, 139, 0.3)',
        icon: '#37474F',
        text: '#263238',
        shadow: 'rgba(96, 125, 139, 0.3)',
      },
    };
    return colorMap[color] || colorMap.primary; // Fallback to primary if color not found
  };

  const colorScheme = getColorScheme();
  const tileSize = getTileSize();

  return (
    <Card
      sx={{
        width: tileSize.width,
        height: tileSize.height,
        display: 'flex',
        flexDirection: 'column',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: `${colorScheme.bg}`,
        border: `1px solid ${colorScheme.border}`,
        borderRadius: { xs: 2, sm: 3 },
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 4px 20px ${colorScheme.shadow}`,
        backdropFilter: 'blur(10px)',
        
        // Gradient overlay effect
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: colorScheme.gradient,
          opacity: 0.1,
          zIndex: 0,
        },
        
        // Floating geometric decoration
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -10,
          right: -10,
          width: 40,
          height: 40,
          background: colorScheme.gradient,
          borderRadius: '50%',
          opacity: 0.15,
          transform: 'rotate(45deg)',
          zIndex: 0,
        },
        
        '&:hover': disabled ? {} : {
          transform: 'translateY(-8px) scale(1.03)',
          background: `${colorScheme.hover}`,
          borderColor: colorScheme.icon,
          boxShadow: `0 12px 40px ${colorScheme.shadow}`,
          
          '& .tile-icon-container': {
            transform: 'scale(1.2) rotate(5deg)',
            background: colorScheme.gradient,
            color: 'white',
            boxShadow: `0 8px 25px ${colorScheme.shadow}`,
          },
          
          '& .tile-content': {
            transform: 'translateY(-4px)',
          },
          
          '& .tile-title': {
            color: colorScheme.icon,
            transform: 'scale(1.05)',
          },
          
          '& .tile-subtitle': {
            color: colorScheme.text,
          },
          
          '&::before': {
            opacity: 0.2,
            height: '60%',
          },
          
          '&::after': {
            opacity: 0.3,
            transform: 'rotate(45deg) scale(1.2)',
          }
        },
        
        opacity: disabled ? 0.6 : 1,
      }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Enhanced Badge */}
      {badge && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'linear-gradient(135deg, #FF4081 0%, #F50057 100%)',
            color: 'white',
            borderRadius: '12px',
            minWidth: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(245, 0, 87, 0.4)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.9, transform: 'scale(1.1)' },
            }
          }}
        >
          {badge}
        </Box>
      )}

      <CardContent
        className="tile-content"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.3s ease',
          '&:last-child': {
            paddingBottom: { xs: 2, sm: 3 },
          },
        }}
      >
        {/* Enhanced Icon Container */}
        <Box
          className="tile-icon-container"
          sx={{
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            borderRadius: 2,
            mb: { xs: 1, sm: 1.5 },
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            color: colorScheme.icon,
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            border: `1px solid ${colorScheme.border}`,
            backdropFilter: 'blur(5px)',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto',
            
            // Shimmer effect
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 3s infinite',
              '@keyframes shimmer': {
                '0%': { left: '-100%' },
                '100%': { left: '100%' }
              }
            },
            
            '& > *': {
              fontSize: { xs: 16, sm: 20 },
              zIndex: 1,
            },
          }}
        >
          {icon}
        </Box>

        {/* Enhanced Title */}
        <Typography
          className="tile-title"
          variant={isMobile ? 'subtitle2' : 'h6'}
          sx={{
            fontWeight: 700,
            color: colorScheme.text,
            lineHeight: 1.2,
            mb: subtitle ? 0.5 : 0,
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            transition: 'all 0.3s ease',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </Typography>

        {/* Enhanced Subtitle */}
        {subtitle && (
          <Typography
            className="tile-subtitle"
            variant="caption"
            sx={{
              color: colorScheme.text,
              opacity: 0.8,
              lineHeight: 1.3,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              textAlign: 'center',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              fontWeight: 500,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionTile;
