import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Paper,
  Divider,
  LinearProgress
} from '@mui/material';
import { 
  ExpandMore, 
  LocationOn, 
  TrendingFlat,
  Store, 
  Phone,
  AccessTime,
  Timeline,
  Refresh,
  FilterList,
  MyLocation,
  Agriculture,
  Nature,
  MonetizationOn
} from '@mui/icons-material';
import { AppIcons } from '../components/icons/AppIcons';
import { api } from '../services/api';

interface MandiPrice {
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
  unit: string;
}

interface MandiData {
  name: string;
  location: string;
  distance?: number;
  prices: MandiPrice[];
  lastUpdated: string;
}

interface TrendData {
  commodity: string;
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

interface Commodity {
  id: string;
  name: string;
  category: string;
  hindi: string;
}

const MandiDataPage: React.FC = () => {
  const [mandiData, setMandiData] = useState<MandiData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get commodity-specific icons and colors
  const getCommodityIcon = (commodity: string) => {
    const commodityLower = commodity.toLowerCase();
    const iconProps = { sx: { fontSize: 24 } };
    
    switch (commodityLower) {
      case 'wheat':
        return <AppIcons.Wheat {...iconProps} />;
      case 'rice':
        return <AppIcons.Rice {...iconProps} />;
      case 'maize':
        return <Agriculture {...iconProps} sx={{ ...iconProps.sx, color: '#FFD54F' }} />;
      case 'onion':
        return <AppIcons.Onion {...iconProps} />;
      case 'potato':
        return <AppIcons.Potato {...iconProps} />;
      case 'tomato':
        return <AppIcons.Tomato {...iconProps} />;
      case 'soybean':
        return <Nature {...iconProps} sx={{ ...iconProps.sx, color: '#4CAF50' }} />;
      case 'cotton':
        return <Agriculture {...iconProps} sx={{ ...iconProps.sx, color: '#E0E0E0' }} />;
      default:
        return <Agriculture {...iconProps} sx={{ ...iconProps.sx, color: 'primary.main' }} />;
    }
  };

  const getCommodityColor = (commodity: string) => {
    const commodityLower = commodity.toLowerCase();
    const colors = {
      wheat: '#FFA726',
      rice: '#66BB6A',
      maize: '#FFD54F',
      onion: '#AB47BC',
      potato: '#8D6E63',
      tomato: '#F44336',
      soybean: '#4CAF50',
      cotton: '#E0E0E0'
    };
    return colors[commodityLower as keyof typeof colors] || '#4CAF50';
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Use default location (Delhi) if geolocation fails
          setUserLocation({ lat: 28.6139, lon: 77.2090 });
        }
      );
    } else {
      // Default to Delhi if geolocation not supported
      setUserLocation({ lat: 28.6139, lon: 77.2090 });
    }
  }, []);

    // Fetch mandi data
  const fetchMandiData = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch nearby mandis
      const nearbyMandis = await api.mandiData.getNearbyMandis(
        userLocation.lat,
        userLocation.lon,
        10 // 10km radius
      );

      // Fetch supported commodities
      const supportedCommodities = await api.mandiData.getSupportedCommodities();
      setCommodities(supportedCommodities);

      // Simulate trend data for popular commodities
      const mockTrends: TrendData[] = [
        {
          commodity: 'Wheat',
          currentPrice: 2100,
          previousPrice: 2050,
          trend: 'up',
          changePercent: 2.4
        },
        {
          commodity: 'Rice',
          currentPrice: 3200,
          previousPrice: 3250,
          trend: 'down',
          changePercent: 1.5
        },
        {
          commodity: 'Onion',
          currentPrice: 1800,
          previousPrice: 1800,
          trend: 'stable',
          changePercent: 0
        },
        {
          commodity: 'Potato',
          currentPrice: 1200,
          previousPrice: 1150,
          trend: 'up',
          changePercent: 4.3
        }
      ];

      setTrendData(mockTrends);
      setMandiData(nearbyMandis);
    } catch (err) {
      setError('Failed to fetch mandi data. Please try again.');
      console.error('Mandi data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMandiData();
  }, [userLocation]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMandiData();
    setRefreshing(false);
  };

  // Filter mandi data by selected commodity
  // Ensure mandiData is always an array
  const safeMandiData = Array.isArray(mandiData) ? mandiData : [];
  const filteredMandiData = selectedCommodity 
    ? safeMandiData.map(mandi => ({
        ...mandi,
        prices: mandi.prices.filter(price => 
          price.commodity.toLowerCase().includes(selectedCommodity.toLowerCase())
        )
      })).filter(mandi => mandi.prices.length > 0)
    : safeMandiData;

  const getTrendIcon = (trend: string) => {
    const iconProps = { sx: { fontSize: '1.2rem' } };
    switch (trend) {
      case 'up':
        return <AppIcons.TrendUp sx={{ ...iconProps.sx, color: 'success.main' }} />;
      case 'down':
        return <AppIcons.TrendDown sx={{ ...iconProps.sx, color: 'error.main' }} />;
      default:
        return <TrendingFlat sx={{ ...iconProps.sx, color: 'warning.main' }} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'success.main';
      case 'down': return 'error.main';
      default: return 'warning.main';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading mandi data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Enhanced Header with Gradient Background */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 4, 
          p: 4,
          background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            opacity: 0.1,
            transform: 'rotate(15deg)'
          }}
        >
          <AppIcons.Mandi sx={{ fontSize: 120 }} />
        </Box>
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  mr: 2,
                  width: 56,
                  height: 56
                }}
              >
                <AppIcons.Mandi sx={{ fontSize: 32, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  मण्डी डेटा
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                  Real-time Market Intelligence
                </Typography>
              </Box>
            </Box>
            
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={refreshData}
                disabled={refreshing}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                {refreshing ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  <Refresh />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            📊 Live prices from nearby mandis • 🌱 Support farmers • 💰 Make informed decisions
          </Typography>
          
          <Box 
            display="flex" 
            alignItems="center" 
            mt={2}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.15)',
              px: 2,
              py: 1,
              borderRadius: 2,
              width: 'fit-content'
            }}
          >
            <MyLocation sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              Showing data within 10km radius of your location
            </Typography>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Enhanced Commodity Filter */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterList sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Filter & Search
            </Typography>
          </Box>
          
          <Box 
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              alignItems: 'center'
            }}
          >
            <Box>
              <FormControl fullWidth>
                <InputLabel>Select Commodity</InputLabel>
                <Select
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                  label="Select Commodity"
                  startAdornment={
                    selectedCommodity ? (
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        {getCommodityIcon(selectedCommodity)}
                      </Box>
                    ) : null
                  }
                >
                  <MenuItem value="">
                    <Box display="flex" alignItems="center">
                      <Agriculture sx={{ mr: 2, color: 'primary.main' }} />
                      All Commodities
                    </Box>
                  </MenuItem>
                  {commodities.map((commodity) => (
                    <MenuItem key={commodity.id} value={commodity.id}>
                      <Box display="flex" alignItems="center">
                        {getCommodityIcon(commodity.name)}
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body1">{commodity.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {commodity.hindi}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  bgcolor: 'primary.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'primary.200'
                }}
              >
                <Box display="flex" alignItems="center">
                  <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Location Radius
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      10km • {filteredMandiData.length} mandis found
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Enhanced Price Trends */}
      {trendData.length > 0 && (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center">
                <Timeline sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Market Trends Today
                </Typography>
              </Box>
              <Chip 
                label="Live Updates" 
                color="success" 
                size="small"
                sx={{ 
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 }
                  }
                }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
              gap: 2 
            }}>
              {trendData.map((trend, index) => (
                <Card 
                  key={index}
                  variant="outlined"
                  sx={{ 
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 2,
                    borderColor: getTrendColor(trend.trend),
                    bgcolor: `${getTrendColor(trend.trend)}08`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    {getCommodityIcon(trend.commodity)}
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ ml: 1 }}>
                      {trend.commodity}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatPrice(trend.currentPrice)}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                    {getTrendIcon(trend.trend)}
                    <Typography 
                      variant="caption" 
                      fontWeight="bold"
                      color={getTrendColor(trend.trend)}
                      sx={{ ml: 0.5 }}
                    >
                      {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}
                      {Math.abs(trend.changePercent).toFixed(1)}%
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.abs(trend.changePercent) * 10} 
                    sx={{ 
                      mt: 1, 
                      height: 4, 
                      borderRadius: 2,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getTrendColor(trend.trend)
                      }
                    }} 
                  />
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Mandi Data */}
      {filteredMandiData.length === 0 ? (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Box 
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <Store sx={{ fontSize: 48, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h5" color="text.secondary" fontWeight="bold" gutterBottom>
              {selectedCommodity ? 
                `No mandis found with ${selectedCommodity} data nearby` :
                'No mandi data available for your location'
              }
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 400, mx: 'auto' }}>
              Try selecting a different commodity or check back later. Our system is constantly updating with new market data.
            </Typography>
            <Box mt={3}>
              <Chip 
                label="Expand search radius?" 
                variant="outlined" 
                color="primary"
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredMandiData.map((mandi, index) => (
            <Card 
              key={index} 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'grey.200',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Accordion 
                elevation={0}
                sx={{ 
                  '&:before': { display: 'none' },
                  '& .MuiAccordionSummary-root': {
                    bgcolor: 'primary.50',
                    borderBottom: '1px solid',
                    borderColor: 'primary.100'
                  }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
                  sx={{ px: 3, py: 2 }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          <AppIcons.Market sx={{ color: 'white' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {mandi.name}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={0.5}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {mandi.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                        {mandi.distance && (
                          <Chip 
                            label={`${mandi.distance.toFixed(1)} km away`}
                            size="small"
                            color="primary"
                            variant="filled"
                            icon={<LocationOn />}
                          />
                        )}
                        <Badge 
                          badgeContent={mandi.prices.length} 
                          color="secondary"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }
                          }}
                        >
                          <Chip 
                            label="commodities"
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Badge>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                      <Box display="flex" alignItems="center">
                        <AccessTime sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                        <Typography variant="caption" color="success.main" fontWeight="medium">
                          Updated: {new Date(mandi.lastUpdated).toLocaleDateString('en-IN')}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center">
                        <MonetizationOn sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          Live prices available
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
                    gap: 3 
                  }}>
                    {mandi.prices.map((price, priceIndex) => (
                      <Card 
                        variant="outlined" 
                        key={priceIndex}
                        sx={{
                          borderRadius: 2,
                          borderColor: getCommodityColor(price.commodity) + '40',
                          bgcolor: getCommodityColor(price.commodity) + '08',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: getCommodityColor(price.commodity),
                            bgcolor: getCommodityColor(price.commodity) + '15',
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            {getCommodityIcon(price.commodity)}
                            <Box sx={{ ml: 1.5 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {price.commodity}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {price.variety}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Divider sx={{ my: 1.5 }} />
                          
                          <Box sx={{ mb: 2 }}>
                            <Box display="flex" alignItems="center" mb={1.5}>
                              <AppIcons.PriceTag sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                                Price Range (₹ per quintal)
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2" color="text.secondary">
                                Min Price
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {formatPrice(price.minPrice)}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2" color="text.secondary">
                                Max Price
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {formatPrice(price.maxPrice)}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2" fontWeight="bold">
                                Modal Price
                              </Typography>
                              <Typography 
                                variant="h6" 
                                fontWeight="bold"
                                sx={{ color: getCommodityColor(price.commodity) }}
                              >
                                {formatPrice(price.modalPrice)}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mt={0.5}>
                              <AppIcons.WeightScale sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                              <Typography variant="caption" color="text.secondary">
                                per {price.unit}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                            sx={{
                              bgcolor: 'background.paper',
                              borderRadius: 1,
                              p: 1
                            }}
                          >
                            <AppIcons.WeightScale sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              As of {new Date(price.date).toLocaleDateString('en-IN')}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                  
                  {/* Contact Information - Only show if there are multiple commodities */}
                  {mandi.prices.length > 3 && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        sx={{
                          bgcolor: 'primary.50',
                          borderRadius: 2,
                          p: 2,
                          border: '1px solid',
                          borderColor: 'primary.100'
                        }}
                      >
                        <Phone sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body2" color="primary.dark" fontWeight="medium">
                          📞 Contact mandi office for bulk purchases & transport
                        </Typography>
                      </Box>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MandiDataPage;
