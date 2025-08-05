const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();
const soilAnalysisService = require('../services/soilAnalysisService');
const { 
  soilTestingCenters, 
  getCentersByState, 
  getCentersByCity, 
  getCentersByLocation 
} = require('../data/soilTestingCenters');

// Validation middleware
const validateSoilAnalysisRequest = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('lon')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO format (YYYY-MM-DD)')
];

const validateLocationSearch = [
  query('city')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City name must be between 2 and 100 characters')
];

const validateLocationSearchQuery = [
  query('query')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters')
];

const validateReverseGeocode = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('lon')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

/**
 * GET /api/soil/analysis
 * Get comprehensive soil analysis using Sentinel-2 satellite imagery
 */
router.get('/analysis', validateSoilAnalysisRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { lat, lon, date } = req.query;
    const analysisDate = date || new Date().toISOString().split('T')[0];

    console.log(`[Soil Analysis] Starting analysis for coordinates: ${lat}, ${lon} on date: ${analysisDate}`);

    const soilAnalysis = await soilAnalysisService.analyzeSoilConditions({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      date: analysisDate
    });

    res.status(200).json({
      success: true,
      data: soilAnalysis,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'Sentinel-2 Satellite Imagery',
        confidence: soilAnalysis.confidence,
        location: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }
      }
    });

  } catch (error) {
    console.error('Error in soil analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze soil conditions',
      message: error.message
    });
  }
});

/**
 * GET /api/soil/location
 * Convert city name to coordinates using geocoding
 */
router.get('/location', validateLocationSearch, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { city } = req.query;
    console.log(`[Geocoding] Looking up coordinates for city: ${city}`);

    const locationData = await soilAnalysisService.geocodeLocation(city);

    res.status(200).json({
      success: true,
      data: locationData
    });

  } catch (error) {
    console.error('Error in geocoding:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to geocode location',
      message: error.message
    });
  }
});

/**
 * GET /api/locations/search
 * Search locations with autocomplete functionality
 */
router.get('/search', validateLocationSearchQuery, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { query } = req.query;
    console.log(`[Location Search] Searching for: ${query}`);

    const searchResults = await soilAnalysisService.searchLocations(query);

    res.status(200).json({
      success: true,
      data: searchResults
    });

  } catch (error) {
    console.error('Error in location search:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search locations',
      message: error.message
    });
  }
});

/**
 * GET /api/locations/reverse
 * Reverse geocoding - get location name from coordinates
 */
router.get('/reverse', validateReverseGeocode, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { lat, lon } = req.query;
    console.log(`[Reverse Geocoding] Looking up location for coordinates: ${lat}, ${lon}`);

    const locationName = await soilAnalysisService.reverseGeocode({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    });

    res.status(200).json({
      success: true,
      data: locationName
    });

  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reverse geocode location',
      message: error.message
    });
  }
});

/**
 * GET /api/sentinel/data
 * Get raw Sentinel-2 satellite data for advanced users
 */
router.get('/data', validateSoilAnalysisRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { lat, lon, start, end } = req.query;
    const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = end || new Date().toISOString().split('T')[0];

    console.log(`[Sentinel Data] Fetching satellite data for ${lat}, ${lon} from ${startDate} to ${endDate}`);

    const sentinelData = await soilAnalysisService.getSentinelData({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      startDate,
      endDate
    });

    res.status(200).json({
      success: true,
      data: sentinelData
    });

  } catch (error) {
    console.error('Error fetching Sentinel data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch satellite data',
      message: error.message
    });
  }
});

/**
 * GET /api/soil/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const healthStatus = await soilAnalysisService.getHealthStatus();
    res.status(200).json({
      success: true,
      status: 'healthy',
      data: healthStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/soil/config/status
 * Get configuration and system status
 */
router.get('/config/status', async (req, res) => {
  try {
    const configStatus = {
      useMockData: process.env.USE_MOCK_DATA === 'true',
      copernicusConfigured: !!(process.env.COPERNICUS_USERNAME && process.env.COPERNICUS_PASSWORD),
      apiLimits: {
        maxRequestsPerHour: 100,
        supportedFormats: ['JSON', 'GeoTIFF'],
        supportedBands: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B8A', 'B09', 'B11', 'B12']
      },
      features: {
        vegetationIndices: ['NDVI', 'NDMI', 'EVI', 'BSI'],
        soilParameters: ['moisture', 'composition', 'pH', 'organicMatter', 'temperature', 'fertility'],
        multiLanguageSupport: true,
        yieldPrediction: true
      }
    };

    res.status(200).json({
      success: true,
      data: configStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get configuration status'
    });
  }
});

/**
 * GET /api/soil/testing-centers
 * Get soil testing centers based on location
 */
router.get('/testing-centers', async (req, res) => {
  try {
    const { state, city, lat, lon, radius } = req.query;

    let centers = [];

    if (lat && lon) {
      // Get centers by coordinates
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      const searchRadius = radius ? parseInt(radius) : 50; // Default 50km radius
      
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({
          success: false,
          error: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.'
        });
      }
      
      centers = getCentersByLocation(latitude, longitude, searchRadius);
    } else if (city && state) {
      // Get centers by city and state
      centers = getCentersByCity(city, state);
    } else if (state) {
      // Get centers by state only
      centers = getCentersByState(state);
    } else {
      // Return all centers if no filter specified
      centers = soilTestingCenters;
    }

    // Add distance information if coordinates are provided
    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      
      centers = centers.map(center => ({
        ...center,
        distance: calculateDistance(latitude, longitude, center.latitude, center.longitude)
      }));
    }

    res.status(200).json({
      success: true,
      data: {
        centers,
        total: centers.length,
        filters: {
          state: state || null,
          city: city || null,
          coordinates: lat && lon ? { latitude: parseFloat(lat), longitude: parseFloat(lon) } : null,
          radius: radius ? parseInt(radius) : null
        }
      }
    });

  } catch (error) {
    console.error('Error fetching testing centers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch soil testing centers'
    });
  }
});

/**
 * GET /api/soil/testing-centers/:id
 * Get specific testing center details
 */
router.get('/testing-centers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const center = soilTestingCenters.find(c => c.id === id);

    if (!center) {
      return res.status(404).json({
        success: false,
        error: 'Testing center not found'
      });
    }

    res.status(200).json({
      success: true,
      data: center
    });

  } catch (error) {
    console.error('Error fetching testing center:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch testing center details'
    });
  }
});

/**
 * GET /api/soil/states
 * Get list of states with available testing centers
 */
router.get('/states', async (req, res) => {
  try {
    const states = [...new Set(soilTestingCenters.map(center => center.state))].sort();
    
    res.status(200).json({
      success: true,
      data: states
    });

  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states list'
    });
  }
});

/**
 * GET /api/soil/cities
 * Get list of cities with available testing centers for a specific state
 */
router.get('/cities', async (req, res) => {
  try {
    const { state } = req.query;
    
    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    const cities = [...new Set(
      soilTestingCenters
        .filter(center => center.state.toLowerCase() === state.toLowerCase())
        .map(center => center.city)
    )].sort();
    
    res.status(200).json({
      success: true,
      data: cities
    });

  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cities list'
    });
  }
});

// Helper function for distance calculation (same as in data file)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;
