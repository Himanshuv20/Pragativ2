const express = require('express');
const router = express.Router();
const MandiDataService = require('../services/mandiDataService');
const MandiDataTrainingService = require('../services/mandiDataTrainingService');
const { body, validationResult, param, query } = require('express-validator');

// Create service instances
const mandiDataService = new MandiDataService();
const trainingService = new MandiDataTrainingService();

/**
 * Get current mandi prices for specific commodity
 * GET /api/mandi-data/prices/:commodity
 */
router.get('/prices/:commodity', [
  param('commodity').notEmpty().withMessage('Commodity is required'),
  query('state').optional().isString(),
  query('district').optional().isString()
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

    const { commodity } = req.params;
    const { state, district } = req.query;

    console.log(`📊 Fetching mandi prices for: ${commodity}`);

    const priceData = await mandiDataService.getMandiPrices(commodity, state, district);

    res.json({
      success: true,
      data: priceData,
      message: `Mandi prices retrieved for ${commodity}`
    });

  } catch (error) {
    console.error('❌ Error in mandi prices route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mandi prices',
      error: error.message
    });
  }
});

/**
 * Get market trends for commodity
 * GET /api/mandi-data/trends/:commodity
 */
router.get('/trends/:commodity', [
  param('commodity').notEmpty().withMessage('Commodity is required'),
  query('state').optional().isString(),
  query('days').optional().isInt({ min: 7, max: 365 })
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

    const { commodity } = req.params;
    const { state, days = 30 } = req.query;

    const trends = await mandiDataService.getMarketTrends(commodity, state, parseInt(days));

    res.json({
      success: true,
      data: trends,
      message: `Market trends retrieved for ${commodity}`
    });

  } catch (error) {
    console.error('❌ Error in market trends route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market trends',
      error: error.message
    });
  }
});

/**
 * Get nearby mandis for location
 * GET /api/mandi-data/nearby
 */
router.get('/nearby', [
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('radius').optional().isInt({ min: 1, max: 200 })
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

    const { latitude, longitude, radius = 50 } = req.query;

    const nearbyMandis = await mandiDataService.getNearbyMandis(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(radius)
    );

    res.json({
      success: true,
      data: nearbyMandis,
      message: `Found ${nearbyMandis.length} mandis within ${radius}km`
    });

  } catch (error) {
    console.error('❌ Error in nearby mandis route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby mandis',
      error: error.message
    });
  }
});

/**
 * Get supported commodities
 * GET /api/mandi-data/commodities
 */
router.get('/commodities', async (req, res) => {
  try {
    const commodities = [
      { id: 'wheat', name: 'Wheat', category: 'cereals', hindi: 'गेहूं' },
      { id: 'rice', name: 'Rice', category: 'cereals', hindi: 'चावल' },
      { id: 'maize', name: 'Maize', category: 'cereals', hindi: 'मक्का' },
      { id: 'cotton', name: 'Cotton', category: 'fiber', hindi: 'कपास' },
      { id: 'sugarcane', name: 'Sugarcane', category: 'cash_crop', hindi: 'गन्ना' },
      { id: 'soybean', name: 'Soybean', category: 'oilseed', hindi: 'सोयाबीन' },
      { id: 'potato', name: 'Potato', category: 'vegetable', hindi: 'आलू' },
      { id: 'onion', name: 'Onion', category: 'vegetable', hindi: 'प्याज' },
      { id: 'tomato', name: 'Tomato', category: 'vegetable', hindi: 'टमाटर' },
      { id: 'chili', name: 'Chili', category: 'spice', hindi: 'मिर्च' },
      { id: 'turmeric', name: 'Turmeric', category: 'spice', hindi: 'हल्दी' },
      { id: 'coriander', name: 'Coriander', category: 'spice', hindi: 'धनिया' }
    ];

    res.json({
      success: true,
      data: commodities,
      message: 'Supported commodities retrieved'
    });

  } catch (error) {
    console.error('❌ Error in commodities route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch commodities',
      error: error.message
    });
  }
});

/**
 * Get mandi data by location (latitude/longitude)
 * GET /api/mandi-data/location
 */
router.get('/location', [
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('commodity').optional().isString()
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

    const { latitude, longitude, commodity = 'wheat' } = req.query;

    // Get location details
    const location = await mandiDataService.getLocationDetails(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    // Get nearby mandis
    const nearbyMandis = await mandiDataService.getNearbyMandis(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    // Get prices for the commodity in this state
    const priceData = await mandiDataService.getMandiPrices(commodity, location.state);

    res.json({
      success: true,
      data: {
        location: location,
        nearbyMandis: nearbyMandis,
        prices: priceData,
        commodity: commodity
      },
      message: `Mandi data retrieved for location (${latitude}, ${longitude})`
    });

  } catch (error) {
    console.error('❌ Error in location-based mandi data route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location-based mandi data',
      error: error.message
    });
  }
});

/**
 * Get ML model training status
 * GET /api/mandi-data/ml/status
 */
router.get('/ml/status', async (req, res) => {
  try {
    const status = await trainingService.getTrainingStatus();
    
    res.json({
      success: true,
      data: status,
      message: 'Training status retrieved'
    });

  } catch (error) {
    console.error('❌ Error in ML status route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get training status',
      error: error.message
    });
  }
});

/**
 * Trigger manual model training
 * POST /api/mandi-data/ml/train
 */
router.post('/ml/train', async (req, res) => {
  try {
    console.log('🤖 Manual ML training triggered');
    
    const result = await trainingService.manualTrain();
    
    if (result) {
      res.json({
        success: true,
        data: result,
        message: 'Model training completed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Training failed - insufficient data or other error'
      });
    }

  } catch (error) {
    console.error('❌ Error in manual training route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to train model',
      error: error.message
    });
  }
});

/**
 * Get price prediction for commodity
 * GET /api/mandi-data/ml/predict/:commodity
 */
router.get('/ml/predict/:commodity', [
  param('commodity').notEmpty().withMessage('Commodity is required'),
  query('state').notEmpty().withMessage('State is required'),
  query('arrivals').optional().isFloat({ min: 0 })
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

    const { commodity } = req.params;
    const { state, arrivals } = req.query;

    console.log(`🔮 Predicting price for ${commodity} in ${state}`);

    const additionalFeatures = {};
    if (arrivals) {
      additionalFeatures.arrivals = parseFloat(arrivals);
    }

    const prediction = await trainingService.predictPrice(commodity, state, additionalFeatures);

    res.json({
      success: true,
      data: prediction,
      message: `Price prediction generated for ${commodity} in ${state}`
    });

  } catch (error) {
    console.error('❌ Error in price prediction route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate price prediction',
      error: error.message
    });
  }
});

/**
 * Get AI-powered price insights and recommendations
 * GET /api/mandi-data/ml/insights/:commodity
 */
router.get('/ml/insights/:commodity', [
  param('commodity').notEmpty().withMessage('Commodity is required'),
  query('state').notEmpty().withMessage('State is required')
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

    const { commodity } = req.params;
    const { state } = req.query;

    console.log(`🧠 Generating AI insights for ${commodity} in ${state}`);

    const insights = await trainingService.getPriceInsights(commodity, state);

    res.json({
      success: true,
      data: insights,
      message: `AI insights generated for ${commodity} in ${state}`
    });

  } catch (error) {
    console.error('❌ Error in AI insights route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI insights',
      error: error.message
    });
  }
});

/**
 * Collect training data manually
 * POST /api/mandi-data/ml/collect
 */
router.post('/ml/collect', async (req, res) => {
  try {
    console.log('📊 Manual data collection triggered');
    
    await trainingService.collectTrainingData();
    
    res.json({
      success: true,
      message: 'Training data collection completed'
    });

  } catch (error) {
    console.error('❌ Error in data collection route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to collect training data',
      error: error.message
    });
  }
});

/**
 * Comprehensive training for Maharashtra and Andhra Pradesh
 * POST /api/mandi-data/ml/train-comprehensive
 */
router.post('/ml/train-comprehensive', async (req, res) => {
  try {
    console.log('🚀 Comprehensive mandi data training initiated for Maharashtra and Andhra Pradesh');
    
    // Set longer timeout for this intensive operation
    req.setTimeout(600000); // 10 minutes
    
    const result = await trainingService.trainComprehensiveMandiData();
    
    if (result.success) {
      res.json({
        success: true,
        data: result,
        message: `Comprehensive training completed successfully. ${result.stats.totalDataPoints} data points collected from ${result.stats.successfulCrops} crops.`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Comprehensive training failed',
        error: result.error,
        stats: result.stats
      });
    }

  } catch (error) {
    console.error('❌ Error in comprehensive training route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute comprehensive training',
      error: error.message
    });
  }
});

/**
 * Get comprehensive training status and progress
 * GET /api/mandi-data/ml/training-status
 */
router.get('/ml/training-status', async (req, res) => {
  try {
    const status = await trainingService.getTrainingStatus();
    
    res.json({
      success: true,
      data: status,
      message: 'Training status retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error in training status route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get training status',
      error: error.message
    });
  }
});

module.exports = router;
