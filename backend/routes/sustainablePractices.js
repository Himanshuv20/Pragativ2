const express = require('express');
const { body, validationResult } = require('express-validator');
const sustainablePracticesService = require('../services/sustainablePracticesService');

const router = express.Router();

// Validation middleware for practice recommendations
const validatePracticeRequest = [
  body('location.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('landSize')
    .isFloat({ min: 0.01, max: 100000 })
    .withMessage('Land size must be a positive number'),
  body('cropTypes')
    .optional()
    .isArray()
    .withMessage('Crop types must be an array'),
  body('practiceTypes')
    .optional()
    .isArray()
    .withMessage('Practice types must be an array'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number')
];

// Get recommended sustainable practices (GET version for frontend compatibility)
router.get('/recommendations', async (req, res) => {
  try {
    const { latitude, longitude, landSize, cropTypes, budget, currentPractices } = req.query;
    
    // Validate required parameters
    if (!latitude || !longitude || !landSize) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: latitude, longitude, landSize'
      });
    }

    const location = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    const parsedLandSize = parseFloat(landSize);
    const parsedCropTypes = cropTypes ? cropTypes.split(',').map(crop => crop.trim()) : [];
    const parsedCurrentPractices = currentPractices ? currentPractices.split(',').map(p => p.trim()) : [];
    
    // Use AI-powered recommendations with fallback to static data
    const recommendations = await sustainablePracticesService.getAIRecommendations(
      location,
      parsedLandSize,
      parsedCurrentPractices,
      parsedCropTypes
    );

    res.json({
      success: true,
      data: recommendations,
      message: 'AI-powered sustainable practices recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error getting sustainable practices recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sustainable practices recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get recommended sustainable practices (POST version)
router.post('/recommendations', validatePracticeRequest, async (req, res) => {
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

    const { location, landSize, cropTypes, practiceTypes, budget, currentPractices } = req.body;
    
    // Use AI-powered recommendations with fallback to static data
    const recommendations = await sustainablePracticesService.getAIRecommendations(
      location,
      landSize,
      currentPractices || [],
      cropTypes || []
    );

    res.json({
      success: true,
      data: recommendations,
      message: 'AI-powered sustainable practices recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error getting sustainable practices recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sustainable practices recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get detailed information about a specific practice
router.get('/details/:practiceId', async (req, res) => {
  try {
    const { practiceId } = req.params;
    
    if (!practiceId) {
      return res.status(400).json({
        success: false,
        message: 'Practice ID is required'
      });
    }

    const practiceDetails = await sustainablePracticesService.getPracticeDetails(practiceId);

    res.json({
      success: true,
      data: practiceDetails,
      message: 'Practice details retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting practice details:', error);
    
    if (error.message === 'Practice not found') {
      return res.status(404).json({
        success: false,
        message: 'Practice not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get practice details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all available practice categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await sustainablePracticesService.getPracticeCategories();

    res.json({
      success: true,
      data: categories,
      message: 'Practice categories retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting practice categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get practice categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Calculate combined impact of multiple practices
router.post('/impact-assessment', [
  body('practiceIds')
    .isArray({ min: 1 })
    .withMessage('Practice IDs must be a non-empty array'),
  body('practiceIds.*')
    .isString()
    .withMessage('Each practice ID must be a string'),
  body('landSize')
    .isFloat({ min: 0.01, max: 100000 })
    .withMessage('Land size must be a positive number')
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

    const { practiceIds, landSize } = req.body;
    
    const impact = await sustainablePracticesService.calculateCombinedImpact(practiceIds, landSize);

    res.json({
      success: true,
      data: impact,
      message: 'Combined impact assessment calculated successfully'
    });

  } catch (error) {
    console.error('Error calculating combined impact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate combined impact',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get practices filtered by specific criteria
router.post('/filter', [
  body('filters.category')
    .optional()
    .isString()
    .withMessage('Category filter must be a string'),
  body('filters.difficulty')
    .optional()
    .isIn(['easy', 'medium', 'high'])
    .withMessage('Difficulty must be easy, medium, or high'),
  body('filters.maxCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max cost must be a positive number'),
  body('filters.environmentalImpact')
    .optional()
    .isString()
    .withMessage('Environmental impact filter must be a string')
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

    const { filters, location, landSize = 10 } = req.body;
    
    // Use the recommendation service with specific filters
    const practiceTypes = filters.category ? [filters.category] : [];
    const budget = filters.maxCost || undefined;
    
    const recommendations = await sustainablePracticesService.getRecommendedPractices({
      location: location || { latitude: 0, longitude: 0 }, // Default location if not provided
      landSize,
      practiceTypes,
      budget
    });

    // Further filter by difficulty if specified
    let filteredPractices = recommendations.recommendedPractices;
    if (filters.difficulty) {
      filteredPractices = filteredPractices.filter(
        practice => practice.implementation.difficulty === filters.difficulty
      );
    }

    res.json({
      success: true,
      data: {
        ...recommendations,
        recommendedPractices: filteredPractices,
        appliedFilters: filters
      },
      message: 'Filtered practices retrieved successfully'
    });

  } catch (error) {
    console.error('Error filtering practices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to filter practices',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get comprehensive sustainability assessment
router.post('/assessment', [
  body('farmData.location.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('farmData.location.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  body('farmData.landSize').isFloat({ min: 0.1 }).withMessage('Land size must be positive'),
  body('currentPractices').isArray().withMessage('Current practices must be an array')
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

    const { farmData, currentPractices } = req.body;
    const assessment = await sustainablePracticesService.generateSustainabilityAssessment(farmData, currentPractices);

    res.json({
      success: true,
      data: assessment,
      message: 'Sustainability assessment generated successfully'
    });
  } catch (error) {
    console.error('Error in sustainability assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate sustainability assessment',
      error: error.message
    });
  }
});

// Get quick sustainability assessment
router.post('/quick-assessment', [
  body('farmData.location.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('farmData.location.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  body('farmData.landSize').isFloat({ min: 0.1 }).withMessage('Land size must be positive')
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

    const { farmData, currentPractices = [] } = req.body;
    const assessment = await sustainablePracticesService.generateQuickAssessment(farmData, currentPractices);

    res.json({
      success: true,
      data: assessment,
      message: 'Quick assessment generated successfully'
    });
  } catch (error) {
    console.error('Error in quick assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quick assessment',
      error: error.message
    });
  }
});

// Helper functions
function calculateSustainabilityScore(currentPractices, recommendations) {
  // Simple scoring algorithm - can be made more sophisticated
  const maxScore = 100;
  const practiceScore = Math.min((currentPractices.length / 5) * 40, 40); // Max 40 points for current practices
  const potentialScore = Math.min((recommendations.recommendedPractices.length / 10) * 60, 60); // Max 60 points for potential
  
  return Math.round(practiceScore + (potentialScore * 0.3)); // 30% of potential
}

function identifyImprovementAreas(practices) {
  const categories = {};
  
  practices.forEach(practice => {
    if (!categories[practice.category]) {
      categories[practice.category] = 0;
    }
    categories[practice.category]++;
  });

  // Return top 3 categories with most opportunities
  return Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category, count]) => ({
      area: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      opportunityCount: count,
      priority: count > 3 ? 'high' : count > 1 ? 'medium' : 'low'
    }));
}

module.exports = router;
