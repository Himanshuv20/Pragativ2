const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const cropCalendarService = require('../services/cropCalendarService');
const satelliteDataService = require('../services/satelliteDataService');

// Validation middleware for crop calendar request
const validateCropCalendarRequest = [
  body('location.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('area')
    .isFloat({ min: 0.001 })
    .withMessage('Area must be a positive number greater than 0.001 hectares'),
  body('cropType')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Crop type must be a string between 2 and 50 characters'),
];

/**
 * GET /api/crop-calendar/crops
 * Get list of supported crop types
 */
router.get('/crops', async (req, res) => {
  try {
    const supportedCrops = await cropCalendarService.getSupportedCrops();
    res.status(200).json({
      success: true,
      data: supportedCrops
    });
  } catch (error) {
    console.error('Error fetching supported crops:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported crops'
    });
  }
});

/**
 * POST /api/crop-calendar/generate
 * Generate a personalized crop calendar based on location, area, and crop type
 */
router.post('/generate', validateCropCalendarRequest, async (req, res) => {
  try {
    // Log the incoming request data for debugging
    console.log('📋 Incoming request body:', JSON.stringify(req.body, null, 2));
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { location, area, cropType } = req.body;
    
    console.log(`Generating crop calendar for ${cropType} at location (${location.latitude}, ${location.longitude}) with area ${area}`);

    // Get satellite data for the location
    const satelliteData = await satelliteDataService.getSatelliteData(location);
    
    // Generate crop calendar based on inputs and satellite data
    const cropCalendar = await cropCalendarService.generateCropCalendar({
      location,
      area,
      cropType,
      satelliteData
    });

    res.status(200).json({
      success: true,
      data: {
        cropCalendar,
        satelliteData: {
          vegetationIndex: satelliteData.vegetationIndex,
          soilMoisture: satelliteData.soilMoisture,
          temperature: satelliteData.temperature,
          precipitation: satelliteData.precipitation,
          lastUpdated: satelliteData.lastUpdated
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          location,
          area,
          cropType
        }
      }
    });

  } catch (error) {
    console.error('Error generating crop calendar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate crop calendar',
      message: error.message
    });
  }
});

/**
 * POST /api/crop-calendar/validate-location
 * Validate if location is suitable for agricultural activities
 */
router.post('/validate-location', [
  body('location.latitude').isFloat({ min: -90, max: 90 }),
  body('location.longitude').isFloat({ min: -180, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { location } = req.body;
    const locationValidation = await cropCalendarService.validateLocation(location);
    
    res.status(200).json({
      success: true,
      data: locationValidation
    });

  } catch (error) {
    console.error('Error validating location:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate location',
      message: error.message
    });
  }
});

module.exports = router;
