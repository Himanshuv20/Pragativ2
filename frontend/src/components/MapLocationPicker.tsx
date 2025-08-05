import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import {
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import 'leaflet/dist/leaflet.css';

// Create custom icons with enhanced styling
const createCustomIcon = (color: string, icon: string) =>
  L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          color: white;
          font-size: 12px;
          transform: rotate(45deg);
          font-weight: bold;
        ">${icon}</span>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });

// Define custom marker icons
const CurrentLocationIcon = createCustomIcon('#2196F3', '●');
const SelectedLocationIcon = createCustomIcon('#4CAF50', '✓');

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
  height?: number;
  showCurrentLocation?: boolean;
}

interface ClickHandlerProps {
  onLocationClick: (lat: number, lng: number) => void;
}

// Component to handle map clicks
const MapClickHandler: React.FC<ClickHandlerProps> = ({ onLocationClick }) => {
  useMapEvents({
    click: (e) => {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapLocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  height = 300,
  showCurrentLocation = true,
}) => {
  const theme = useTheme();
  const mapRef = useRef<L.Map | null>(null);
  
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');

  // Handle map click to select location
  const handleMapClick = (lat: number, lng: number) => {
    const newPosition = { lat, lng };
    setSelectedPosition(newPosition);
    onLocationSelect(lat, lng);
    setLocationStatus(`Selected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  // Get current location using geolocation API
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    setLocationStatus('Getting your location...');

    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser.';
      setLocationError(error);
      setLocationStatus('Geolocation not supported');
      setIsLoadingLocation(false);
      return;
    }

    // Check if we're on HTTPS or localhost
    const isSecureContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecureContext) {
      const error = 'Geolocation requires HTTPS or localhost.';
      setLocationError(error);
      setLocationStatus('Requires HTTPS');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };
        
        setCurrentPosition(newPosition);
        setSelectedPosition(newPosition);
        onLocationSelect(latitude, longitude);
        setLocationStatus(`Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsLoadingLocation(false);
        setLocationError(null);

        // Pan map to current location
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        setLocationError(errorMessage);
        setLocationStatus('Location error');
        setIsLoadingLocation(false);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Initialize map with initial location if provided
  useEffect(() => {
    if (initialLocation) {
      setSelectedPosition(initialLocation);
      setLocationStatus(`Initial: ${initialLocation.lat.toFixed(6)}, ${initialLocation.lng.toFixed(6)}`);
    }
  }, [initialLocation]);

  const defaultCenter = selectedPosition || currentPosition || { lat: 28.6139, lng: 77.2090 }; // Default to Delhi

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Header with instructions and status */}
      <Box sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          📍 Click on the map to select a location or use the button below to get your current location
        </Typography>
        
        {locationStatus && (
          <Typography variant="caption" color="primary" sx={{ display: 'block', fontWeight: 500 }}>
            {locationStatus}
          </Typography>
        )}
      </Box>

      {/* Get Current Location Button */}
      {showCurrentLocation && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Get your current GPS location">
            <Button
              variant="outlined"
              startIcon={isLoadingLocation ? undefined : <MyLocationIcon />}
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              sx={{
                minWidth: 200,
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              {isLoadingLocation ? 'Getting Location...' : 'Get Current Location'}
            </Button>
          </Tooltip>
          
          {selectedPosition && (
            <Typography variant="body2" color="text.secondary">
              Selected: {selectedPosition.lat.toFixed(4)}, {selectedPosition.lng.toFixed(4)}
            </Typography>
          )}
        </Box>
      )}

      {/* Loading indicator */}
      {isLoadingLocation && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress color="primary" />
        </Box>
      )}

      {/* Error alert */}
      {locationError && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setLocationError(null)}>
          {locationError}
        </Alert>
      )}

      {/* Map Container */}
      <Box
        sx={{
          height,
          width: '100%',
          border: `2px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
          '& .leaflet-container': {
            height: '100%',
            width: '100%',
          },
          '& .custom-marker': {
            border: 'none !important',
            background: 'transparent !important',
          },
        }}
      >
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationClick={handleMapClick} />
          
          {/* Current location marker */}
          {currentPosition && (
            <Marker
              position={[currentPosition.lat, currentPosition.lng]}
              icon={CurrentLocationIcon}
            />
          )}
          
          {/* Selected location marker */}
          {selectedPosition && (
            <Marker
              position={[selectedPosition.lat, selectedPosition.lng]}
              icon={SelectedLocationIcon}
            />
          )}
        </MapContainer>
      </Box>

      {/* Help text */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        💡 Tip: You can zoom and pan the map to find your exact location. The green marker shows your selected location.
      </Typography>
    </Box>
  );
};

export default MapLocationPicker;
