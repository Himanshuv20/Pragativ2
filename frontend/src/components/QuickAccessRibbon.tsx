import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Fab,
  Box,
  Collapse,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import {
  Apps as AppsIcon,
  Close as CloseIcon,
  WbSunny as WeatherIcon,
  Nature as SoilTestIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const RibbonContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  right: 20,
  transform: 'translateY(-50%)',
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
}));

const QuickAccessFab = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const RibbonMenu = styled(Paper)(({ theme }) => ({
  width: 280,
  maxHeight: 400,
  borderRadius: 12,
  boxShadow: theme.shadows[8],
  overflow: 'hidden',
  marginBottom: theme.spacing(1),
}));

const MenuHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const QuickAccessRibbon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const quickAccessItems = [
    {
      title: 'Weather',
      subtitle: 'Weather forecast and alerts',
      icon: <WeatherIcon />,
      path: '/weather',
      color: theme.palette.info.main,
    },
    {
      title: 'Soil Analysis',
      subtitle: 'Test soil health and quality',
      icon: <SoilTestIcon />,
      path: '/soil-analysis',
      color: theme.palette.success.main,
    },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleRibbon = () => {
    setIsOpen(!isOpen);
  };

  return (
    <RibbonContainer>
      {/* Dropdown Menu */}
      <Collapse in={isOpen} timeout={300}>
        <RibbonMenu elevation={8}>
          <MenuHeader>
            <Typography variant="h6" fontWeight="bold">
              Quick Access
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Essential farming tools
            </Typography>
          </MenuHeader>
          
          <List sx={{ p: 0 }}>
            {quickAccessItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item.path)}
                  sx={{
                    py: 2,
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.color,
                      minWidth: 48,
                      '& svg': {
                        fontSize: '1.75rem',
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {item.subtitle}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </RibbonMenu>
      </Collapse>

      {/* Toggle FAB */}
      <Tooltip 
        title={isOpen ? 'Close' : 'Quick Access'} 
        placement="left"
        arrow
      >
        <QuickAccessFab 
          onClick={toggleRibbon}
          sx={{
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          {isOpen ? <CloseIcon /> : <AppsIcon />}
        </QuickAccessFab>
      </Tooltip>
    </RibbonContainer>
  );
};

export default QuickAccessRibbon;
