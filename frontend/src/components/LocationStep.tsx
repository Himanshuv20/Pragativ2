import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  InputAdornment,
  Stack
} from '@mui/material';
import {
  LocationOn,
  MyLocation,
  Public,
  GpsFixed,
  Warning
} from '@mui/icons-material';
import { useCropCalendar } from '../context/CropCalendarContext';
import { useLanguage } from '../context/LanguageContext';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  city?: string;
  country?: string;
}

const LocationStep: React.FC = () => {
  const { formData, updateFormData } = useCropCalendar();
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'current' | 'manual'>('current');
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLng, setManualLng] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [locationData, setLocationData] = useState<LocationData | null>(
    formData.location ? {
      latitude: formData.location.latitude,
      longitude: formData.location.longitude
    } : null
  );
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');

  // Check geolocation permission on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as 'granted' | 'denied' | 'pending');
      });
    }
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError(t('location.geolocationNotSupported', 'Geolocation is not supported by this browser.'));
      setLoading(false);
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      // Try to get address information using reverse geocoding
      const addressInfo = await getAddressFromCoordinates(latitude, longitude);
      
      const newLocationData: LocationData = {
        latitude,
        longitude,
        accuracy,
        ...addressInfo
      };

      setLocationData(newLocationData);
      updateFormData({ location: { latitude, longitude } });
      setLocationPermission('granted');
      
    } catch (error: any) {
      console.error('Error getting location:', error);
      setLocationPermission('denied');
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError(t('location.accessDenied', 'Location access denied. Please enable location services and try again.'));
          break;
        case error.POSITION_UNAVAILABLE:
          setError(t('location.locationUnavailable', 'Location information is unavailable. Please try manual input.'));
          break;
        case error.TIMEOUT:
          setError(t('location.requestTimeout', 'Location request timed out. Please try again or use manual input.'));
          break;
        default:
          setError(t('location.unknownError', 'An unknown error occurred while getting your location.'));
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      // Using a free geocoding service (OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          address: data.display_name,
          city: data.address?.city || data.address?.town || data.address?.village,
          country: data.address?.country
        };
      }
    } catch (error) {
      console.warn('Could not fetch address information:', error);
    }
    return {};
  };

  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      setError(t('location.invalidCoordinates', 'Please enter valid numeric coordinates.'));
      return;
    }

    if (lat < -90 || lat > 90) {
      setError(t('location.latitudeRange', 'Latitude must be between -90 and 90 degrees.'));
      return;
    }

    if (lng < -180 || lng > 180) {
      setError(t('location.longitudeRange', 'Longitude must be between -180 and 180 degrees.'));
      return;
    }

    setError('');
    const newLocationData: LocationData = {
      latitude: lat,
      longitude: lng
    };

    setLocationData(newLocationData);
    updateFormData({ location: { latitude: lat, longitude: lng } });

    // Try to get address for the manual coordinates
    getAddressFromCoordinates(lat, lng).then((addressInfo) => {
      setLocationData(prev => prev ? { ...prev, ...addressInfo } : null);
    });
  };

  const resetLocation = () => {
    setLocationData(null);
    updateFormData({ location: null });
    setError('');
    setManualLat('');
    setManualLng('');
  };

  const formatCoordinates = (lat: number, lng: number) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        📍 {t('location.title', 'Select Your Location')}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        {t('location.subtitle', 'Choose your farm or field location to get accurate agricultural recommendations and satellite data.')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {locationData ? (
        // Location Selected - Show Details
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                Location Selected
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('location.coordinates')}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {formatCoordinates(locationData.latitude, locationData.longitude)}
                </Typography>
              </Box>
              
              {locationData.accuracy && (
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('location.accuracy')}
                  </Typography>
                  <Typography variant="body1">
                    ±{Math.round(locationData.accuracy)}m
                  </Typography>
                </Box>
              )}
            </Box>
            
            {locationData.address && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('location.address')}
                </Typography>
                <Typography variant="body1">
                  {locationData.address}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {locationData.city && (
                <Chip
                  icon={<Public />}
                  label={locationData.city}
                  size="small"
                  variant="outlined"
                />
              )}
              {locationData.country && (
                <Chip
                  label={locationData.country}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            <Button
              onClick={resetLocation}
              color="secondary"
            >
              {t('location.changeLocation', 'Change Location')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Location Selection Interface
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card 
              sx={{ 
                height: '100%',
                border: selectedMethod === 'current' ? 2 : 1,
                borderColor: selectedMethod === 'current' ? 'primary.main' : 'divider',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedMethod('current')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <MyLocation 
                  sx={{ 
                    fontSize: 48, 
                    color: selectedMethod === 'current' ? 'primary.main' : 'text.secondary',
                    mb: 2 
                  }} 
                />
                <Typography variant="h6" gutterBottom>
                  {t('location.useCurrentLocation', 'Use Current Location')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {t('location.autoDetect', 'Automatically detect your current GPS location')}
                </Typography>
                
                {selectedMethod === 'current' && (
                  <Box>
                    {locationPermission === 'denied' && (
                      <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Warning sx={{ mr: 1 }} />
                          {t('location.accessDeniedBrowser', 'Location access denied. Please enable location services in your browser.')}
                        </Box>
                      </Alert>
                    )}
                    
                    <Button
                      variant="contained"
                      onClick={getCurrentLocation}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <GpsFixed />}
                      sx={{ minWidth: 160 }}
                    >
                      {loading ? t('location.gettingLocation', 'Getting Location...') : t('location.getLocation', 'Get Location')}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Card 
              sx={{ 
                height: '100%',
                border: selectedMethod === 'manual' ? 2 : 1,
                borderColor: selectedMethod === 'manual' ? 'primary.main' : 'divider',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedMethod('manual')}
            >
              <CardContent sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Public 
                    sx={{ 
                      fontSize: 48, 
                      color: selectedMethod === 'manual' ? 'primary.main' : 'text.secondary',
                      mb: 2 
                    }} 
                  />
                                    <Typography variant="h6" gutterBottom>
                    {t('location.enterCoordinates', 'Enter Coordinates')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('location.manualEntry', 'Manually enter latitude and longitude coordinates')}
                  </Typography>
                </Box>

                {selectedMethod === 'manual' && (
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label={t('location.latitude', 'Latitude')}
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      placeholder={t('location.latitudePlaceholder', 'e.g., 40.7128')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">°N/S</InputAdornment>
                        ),
                      }}
                      helperText={t('location.latitudeHelp', 'Range: -90 to 90 degrees')}
                    />
                    
                    <TextField
                      fullWidth
                      label={t('location.longitude', 'Longitude')}
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      placeholder={t('location.longitudePlaceholder', 'e.g., -74.0060')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">°E/W</InputAdornment>
                        ),
                      }}
                      helperText={t('location.longitudeHelp', 'Range: -180 to 180 degrees')}
                    />
                    
                    <Button
                      variant="contained"
                      onClick={handleManualSubmit}
                      fullWidth
                      disabled={!manualLat || !manualLng}
                    >
                      {t('location.setLocation', 'Set Location')}
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Tip:</strong> Accurate location data helps us provide better crop recommendations 
          and satellite-based insights for your specific area.
        </Typography>
      </Box>
    </Box>
  );
};

export default LocationStep;
