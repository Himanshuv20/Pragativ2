const express = require('express');
const { body, validationResult } = require('express-validator');
const sosEmergencyService = require('../services/sosEmergencyService');

const router = express.Router();

// Validation middleware for SOS submissions
const validateSOSSubmission = [
  body('location.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('emergencyType')
    .isIn(['pest_disease', 'weather_damage', 'equipment_failure', 'soil_issues', 'irrigation_problems', 'livestock_emergency', 'other'])
    .withMessage('Invalid emergency type'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('contactInfo.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address'),
  body('cropType')
    .optional()
    .isString()
    .withMessage('Crop type must be a string'),
  body('farmSize')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Farm size must be a positive number')
];

// Submit SOS emergency request
router.post('/submit', validateSOSSubmission, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const emergencyData = req.body;
    const result = await sosEmergencyService.submitEmergency(emergencyData);

    res.status(201).json({
      success: true,
      message: 'Emergency request submitted successfully',
      data: result
    });

  } catch (error) {
    console.error('Error submitting SOS emergency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit emergency request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get emergency response recommendations
router.post('/recommendations', [
  body('emergencyType').notEmpty().withMessage('Emergency type is required'),
  body('severity').notEmpty().withMessage('Severity is required'),
  body('location.latitude').isFloat({ min: -90, max: 90 }),
  body('location.longitude').isFloat({ min: -180, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { emergencyType, severity, location, cropType, description } = req.body;
    const recommendations = await sosEmergencyService.getEmergencyRecommendations({
      emergencyType,
      severity,
      location,
      cropType,
      description
    });

    res.json({
      success: true,
      data: recommendations
    });

  } catch (error) {
    console.error('Error getting emergency recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emergency recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get nearby agricultural resources/contacts
router.post('/resources', [
  body('location.latitude').isFloat({ min: -90, max: 90 }),
  body('location.longitude').isFloat({ min: -180, max: 180 }),
  body('resourceType').optional().isIn(['veterinary', 'extension_office', 'equipment_rental', 'emergency_services', 'agricultural_supply'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { location, resourceType, radius = 50 } = req.body;
    const resources = await sosEmergencyService.getNearbyResources(location, resourceType, radius);

    res.json({
      success: true,
      data: resources
    });

  } catch (error) {
    console.error('Error getting nearby resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nearby resources',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get emergency status/tracking
router.get('/status/:emergencyId', async (req, res) => {
  try {
    const { emergencyId } = req.params;
    const status = await sosEmergencyService.getEmergencyStatus(emergencyId);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Error getting emergency status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emergency status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
