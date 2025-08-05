const express = require('express');
const { body, validationResult } = require('express-validator');
const AIRecommendationService = require('../services/aiRecommendationService');
const satelliteService = require('../services/satelliteDataService');

const router = express.Router();
const aiService = new AIRecommendationService();

/**
 * Get AI-powered crop recommendations
 * POST /api/ai-recommendations
 */
router.post('/', [
  body('location.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('area')
    .isFloat({ min: 0.1 })
    .withMessage('Area must be a positive number'),
  body('soilType')
    .optional()
    .isString()
    .trim()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input parameters',
        details: errors.array()
      });
    }

    const { location, area, soilType } = req.body;
    
    console.log(`🤖 AI Recommendation request for location: ${location.latitude}, ${location.longitude}`);

    // Get current satellite data
    const satelliteData = await satelliteService.getSatelliteData(location);
    
    // Get AI recommendations
    const aiRecommendation = await aiService.getCropRecommendation({
      location,
      satelliteData,
      area,
      soilType: soilType || satelliteData.soilMoisture.status
    });

    res.json({
      success: true,
      data: {
        aiRecommendation: aiRecommendation.aiRecommendation,
        cropRecommendations: aiRecommendation.cropRecommendations,
        satelliteData: satelliteData,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI recommendations',
      message: error.message
    });
  }
});

/**
 * Get AI model status and information
 * GET /api/ai-recommendations/status
 */
router.get('/status', async (req, res) => {
  try {
    const hasApiKey = !!process.env.HUGGINGFACE_API_KEY;
    
    res.json({
      success: true,
      data: {
        modelId: 'cropinailab/aksara_v1',
        apiKeyConfigured: hasApiKey,
        status: hasApiKey ? 'ready' : 'api-key-required',
        fallbackMode: !hasApiKey,
        capabilities: [
          'crop-recommendations',
          'risk-assessment',
          'yield-predictions',
          'management-practices'
        ]
      }
    });
  } catch (error) {
    console.error('Error getting AI service status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI service status'
    });
  }
});

/**
 * Test AI model with sample data
 * POST /api/ai-recommendations/test
 */
router.post('/test', async (req, res) => {
  try {
    const testParams = {
      location: { latitude: 28.6139, longitude: 77.2090 }, // Delhi, India
      satelliteData: {
        vegetationIndex: { ndvi: 0.6, evi: 0.4 },
        soilMoisture: { percentage: 45, status: 'optimal' },
        temperature: { current: 25, min: 20, max: 30 },
        precipitation: { last7Days: 15, last30Days: 60 },
        humidity: 65,
        cloudCover: 40,
        windSpeed: 10
      },
      area: 2.5,
      soilType: 'loamy'
    };

    console.log('🧪 Testing AI model with sample data...');
    
    const aiRecommendation = await aiService.getCropRecommendation(testParams);

    res.json({
      success: true,
      data: {
        testParameters: testParams,
        aiResponse: aiRecommendation,
        testStatus: 'completed',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error testing AI model:', error);
    res.status(500).json({
      success: false,
      error: 'AI model test failed',
      message: error.message
    });
  }
});

module.exports = router;
