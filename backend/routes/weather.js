const express = require('express');
const { body, query, validationResult } = require('express-validator');
const weatherService = require('../services/weatherService');

const router = express.Router();

// Validation middleware for weather requests
const validateLocationRequest = [
  query('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

const validateForecastRequest = [
  ...validateLocationRequest,
  query('days')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('Days must be between 1 and 30')
];

// GET /api/weather/current - Get current weather conditions
router.get('/current', validateLocationRequest, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { latitude, longitude } = req.query;
    
    console.log(`🌤️ Current weather request for: ${latitude}, ${longitude}`);
    
    const currentWeather = await weatherService.getCurrentWeather(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    res.json({
      success: true,
      data: currentWeather,
      message: 'Current weather data retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting current weather:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get current weather data',
      message: error.message
    });
  }
});

// GET /api/weather/forecast - Get weather forecast
router.get('/forecast', validateForecastRequest, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { latitude, longitude, days = 7 } = req.query;
    
    console.log(`🌦️ Weather forecast request for: ${latitude}, ${longitude} (${days} days)`);
    
    const forecast = await weatherService.getWeatherForecast(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(days)
    );

    res.json({
      success: true,
      data: forecast,
      message: `${days}-day weather forecast retrieved successfully`
    });

  } catch (error) {
    console.error('Error getting weather forecast:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weather forecast',
      message: error.message
    });
  }
});

// GET /api/weather/comprehensive - Get current weather + forecast in one call
router.get('/comprehensive', validateForecastRequest, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { latitude, longitude, days = 7 } = req.query;
    
    console.log(`🌍 Comprehensive weather request for: ${latitude}, ${longitude} (${days} days)`);
    
    const comprehensiveData = await weatherService.getComprehensiveWeatherData(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(days)
    );

    res.json({
      success: true,
      data: comprehensiveData,
      message: 'Comprehensive weather data retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting comprehensive weather data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get comprehensive weather data',
      message: error.message
    });
  }
});

// GET /api/weather/health - Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const healthStatus = {
      service: 'Weather API',
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: {
        current: '/api/weather/current?latitude={lat}&longitude={lon}',
        forecast: '/api/weather/forecast?latitude={lat}&longitude={lon}&days={days}',
        comprehensive: '/api/weather/comprehensive?latitude={lat}&longitude={lon}&days={days}'
      },
      apiKey: process.env.OPENWEATHER_API_KEY ? 'configured' : 'missing',
      limits: {
        maxForecastDays: 30,
        coordinateRange: {
          latitude: [-90, 90],
          longitude: [-180, 180]
        }
      }
    };

    res.json({
      success: true,
      data: healthStatus,
      message: 'Weather service is operational'
    });

  } catch (error) {
    console.error('Error checking weather service health:', error);
    res.status(500).json({
      success: false,
      error: 'Weather service health check failed',
      message: error.message
    });
  }
});

// POST /api/weather/bulk-locations - Get weather for multiple locations
router.post('/bulk-locations', [
  body('locations')
    .isArray({ min: 1, max: 10 })
    .withMessage('Locations must be an array with 1-10 items'),
  body('locations.*.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Each location must have valid latitude'),
  body('locations.*.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Each location must have valid longitude'),
  body('locations.*.name')
    .optional()
    .isString()
    .withMessage('Location name must be a string'),
  body('includeforecast')
    .optional()
    .isBoolean()
    .withMessage('includeForeast must be a boolean'),
  body('forecastDays')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('Forecast days must be between 1 and 30')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { locations, includeForeast = false, forecastDays = 7 } = req.body;
    
    console.log(`🌐 Bulk weather request for ${locations.length} locations`);
    
    const results = await Promise.allSettled(
      locations.map(async (location) => {
        try {
          if (includeForeast) {
            const data = await weatherService.getComprehensiveWeatherData(
              location.latitude,
              location.longitude,
              forecastDays
            );
            return {
              location: {
                ...location,
                latitude: location.latitude,
                longitude: location.longitude
              },
              data,
              status: 'success'
            };
          } else {
            const data = await weatherService.getCurrentWeather(
              location.latitude,
              location.longitude
            );
            return {
              location: {
                ...location,
                latitude: location.latitude,
                longitude: location.longitude
              },
              data,
              status: 'success'
            };
          }
        } catch (error) {
          return {
            location: {
              ...location,
              latitude: location.latitude,
              longitude: location.longitude
            },
            error: error.message,
            status: 'failed'
          };
        }
      })
    );

    const processedResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          location: locations[index],
          error: result.reason.message,
          status: 'failed'
        };
      }
    });

    const successCount = processedResults.filter(r => r.status === 'success').length;
    const failureCount = processedResults.length - successCount;

    res.json({
      success: true,
      data: {
        results: processedResults,
        summary: {
          total: locations.length,
          successful: successCount,
          failed: failureCount
        }
      },
      message: `Bulk weather data processed: ${successCount} successful, ${failureCount} failed`
    });

  } catch (error) {
    console.error('Error processing bulk weather request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process bulk weather request',
      message: error.message
    });
  }
});

module.exports = router;
