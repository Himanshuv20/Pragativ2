const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const satelliteDataService = require('../services/satelliteDataService');

/**
 * POST /api/satellite-data/current
 * Get current satellite data for a specific location
 */
router.post('/current', [
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
    const satelliteData = await satelliteDataService.getSatelliteData(location);
    
    res.status(200).json({
      success: true,
      data: satelliteData
    });

  } catch (error) {
    console.error('Error fetching satellite data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch satellite data',
      message: error.message
    });
  }
});

/**
 * POST /api/satellite-data/historical
 * Get historical satellite data for trend analysis
 */
router.post('/historical', [
  body('location.latitude').isFloat({ min: -90, max: 90 }),
  body('location.longitude').isFloat({ min: -180, max: 180 }),
  body('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date')
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

    const { location, startDate, endDate } = req.body;
    const historicalData = await satelliteDataService.getHistoricalData(location, startDate, endDate);
    
    res.status(200).json({
      success: true,
      data: historicalData
    });

  } catch (error) {
    console.error('Error fetching historical satellite data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical satellite data',
      message: error.message
    });
  }
});

module.exports = router;
