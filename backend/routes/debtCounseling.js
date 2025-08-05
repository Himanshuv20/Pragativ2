const express = require('express');
const router = express.Router();
const debtCounselingService = require('../services/debtCounselingService');
const { body, validationResult, param, query } = require('express-validator');

/**
 * Analyze debt profile and get comprehensive recommendations
 * POST /api/debt-counseling/analyze
 */
router.post('/analyze', [
  body('farmerId').notEmpty().withMessage('Farmer ID is required'),
  body('debtData').isObject().withMessage('Debt data is required'),
  body('debtData.totalDebt').isNumeric().withMessage('Total debt must be a number'),
  body('debtData.monthlyIncome').isNumeric().withMessage('Monthly income must be a number'),
  body('debtData.monthlyExpenses').isNumeric().withMessage('Monthly expenses must be a number'),
  body('debtData.farmSize').optional().isNumeric().withMessage('Farm size must be a number'),
  body('debtData.state').optional().isString().withMessage('State must be a string'),
  body('debtData.loans').optional().isArray().withMessage('Loans must be an array')
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

    const { farmerId, debtData } = req.body;
    
    console.log(`🏦 Analyzing debt profile for farmer: ${farmerId}`);
    
    const analysis = await debtCounselingService.analyzeDebtProfile(farmerId, debtData);
    
    res.json({
      success: true,
      data: analysis,
      message: 'Debt analysis completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in debt analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze debt profile',
      error: error.message
    });
  }
});

/**
 * Get credit counseling resources by location
 * GET /api/debt-counseling/resources
 */
router.get('/resources', [
  query('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  query('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  query('district').optional().isString().trim(),
  query('state').optional().isString().trim()
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

    const location = {
      latitude: req.query.latitude ? parseFloat(req.query.latitude) : null,
      longitude: req.query.longitude ? parseFloat(req.query.longitude) : null,
      district: req.query.district || 'Unknown District',
      state: req.query.state || 'Unknown State'
    };

    console.log('📍 Fetching counseling resources for location:', location);

    const resources = await debtCounselingService.getCreditCounselingResources(location);

    res.json({
      success: true,
      data: resources,
      message: 'Credit counseling resources retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching counseling resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch counseling resources',
      error: error.message
    });
  }
});

/**
 * Generate personalized budgeting template
 * POST /api/debt-counseling/budget-template
 */
router.post('/budget-template', [
  body('debtData').isObject().withMessage('Debt data is required'),
  body('debtData.monthlyIncome').isNumeric().withMessage('Monthly income is required'),
  body('debtData.monthlyExpenses').isNumeric().withMessage('Monthly expenses is required')
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

    const { debtData } = req.body;
    
    console.log('💰 Generating budget template for farmer');
    
    const budgetTemplate = debtCounselingService.generateBudgetingTemplate(debtData);
    
    res.json({
      success: true,
      data: budgetTemplate,
      message: 'Budget template generated successfully'
    });

  } catch (error) {
    console.error('❌ Error generating budget template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate budget template',
      error: error.message
    });
  }
});

/**
 * Check eligibility for government schemes
 * POST /api/debt-counseling/check-schemes
 */
router.post('/check-schemes', [
  body('debtData').isObject().withMessage('Debt data is required'),
  body('debtData.farmSize').optional().isNumeric().withMessage('Farm size must be a number'),
  body('debtData.totalDebt').optional().isNumeric().withMessage('Total debt must be a number'),
  body('debtData.state').optional().isString().withMessage('State must be a string')
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

    const { debtData } = req.body;
    
    console.log('🎯 Checking scheme eligibility for farmer');
    
    const schemes = await debtCounselingService.checkSchemeEligibility(debtData);
    
    res.json({
      success: true,
      data: schemes,
      message: 'Scheme eligibility checked successfully',
      eligibleCount: schemes.filter(scheme => scheme.status === 'eligible').length,
      totalSchemes: schemes.length
    });

  } catch (error) {
    console.error('❌ Error checking scheme eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check scheme eligibility',
      error: error.message
    });
  }
});

/**
 * Get current agricultural interest rates
 * GET /api/debt-counseling/interest-rates
 */
router.get('/interest-rates', async (req, res) => {
  try {
    console.log('📊 Fetching current interest rates');
    
    const rates = await debtCounselingService.getCurrentInterestRates();
    
    res.json({
      success: true,
      data: rates,
      message: 'Interest rates retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching interest rates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interest rates',
      error: error.message
    });
  }
});

/**
 * Get agricultural market indicators for financial planning
 * GET /api/debt-counseling/market-indicators
 */
router.get('/market-indicators', async (req, res) => {
  try {
    console.log('📈 Fetching agricultural market indicators');
    
    const indicators = await debtCounselingService.getAgriculturalMarketIndicators();
    
    res.json({
      success: true,
      data: indicators,
      message: 'Market indicators retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching market indicators:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market indicators',
      error: error.message
    });
  }
});

/**
 * Quick debt health check
 * POST /api/debt-counseling/quick-check
 */
router.post('/quick-check', [
  body('totalDebt').isNumeric().withMessage('Total debt is required'),
  body('monthlyIncome').isNumeric().withMessage('Monthly income is required'),
  body('monthlyExpenses').isNumeric().withMessage('Monthly expenses is required')
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

    const { totalDebt, monthlyIncome, monthlyExpenses } = req.body;
    
    console.log('⚡ Performing quick debt health check');
    
    // Calculate basic metrics
    const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) : 0;
    const savingsCapacity = monthlyIncome - monthlyExpenses;
    const financialHealth = debtCounselingService.calculateFinancialHealth(
      debtToIncomeRatio, 0, savingsCapacity
    );
    
    const riskLevel = debtCounselingService.assessRiskLevel({
      financialHealth,
      debtToIncomeRatio,
      savingsCapacity,
      debtServiceRatio: 0
    });

    const quickAssessment = {
      financialHealth,
      debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,
      savingsCapacity,
      riskLevel,
      recommendations: [
        riskLevel.level === 'HIGH' ? 
          'Seek immediate professional help for debt management' :
        riskLevel.level === 'MEDIUM' ?
          'Consider creating a debt reduction plan' :
          'Continue monitoring and maintain good financial habits'
      ]
    };

    res.json({
      success: true,
      data: quickAssessment,
      message: 'Quick debt health check completed'
    });

  } catch (error) {
    console.error('❌ Error in quick check:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform quick check',
      error: error.message
    });
  }
});

/**
 * Financial health monitoring endpoint
 * GET /api/debt-counseling/health-monitor/:farmerId
 */
router.get('/health-monitor/:farmerId', [
  param('farmerId').notEmpty().withMessage('Farmer ID is required')
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

    const { farmerId } = req.params;
    
    console.log(`📊 Health monitoring for farmer: ${farmerId}`);
    
    // In a real implementation, this would fetch historical data from database
    const healthMonitoring = {
      farmerId,
      currentScore: 72,
      trend: 'improving',
      monthlyHistory: [
        { month: 'Jan', score: 65 },
        { month: 'Feb', score: 68 },
        { month: 'Mar', score: 70 },
        { month: 'Apr', score: 72 }
      ],
      alerts: [
        {
          type: 'positive',
          message: 'Debt-to-income ratio improved by 5% this month',
          date: new Date().toISOString()
        }
      ],
      nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    res.json({
      success: true,
      data: healthMonitoring,
      message: 'Health monitoring data retrieved'
    });

  } catch (error) {
    console.error('❌ Error in health monitoring:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health monitoring data',
      error: error.message
    });
  }
});

/**
 * Get financial advisors based on location
 * GET /api/debt-counseling/advisors
 */
router.get('/advisors', [
  query('state').optional().isString().withMessage('State must be a string'),
  query('city').optional().isString().withMessage('City must be a string'),
  query('district').optional().isString().withMessage('District must be a string'),
  query('specialization').optional().isString().withMessage('Specialization must be a string'),
  query('maxFee').optional().isNumeric().withMessage('Max fee must be a number'),
  query('language').optional().isString().withMessage('Language must be a string')
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

    const { state, city, district, specialization, maxFee, language } = req.query;
    
    const location = { state, city, district };
    
    console.log(`👨‍💼 Fetching financial advisors for location:`, location);
    
    // Get advisors from the service (simulated data)
    let advisors = await debtCounselingService.getFinancialAdvisors(location);
    
    // Apply additional filters if provided
    if (specialization) {
      advisors.advisors = advisors.advisors.filter(advisor => 
        advisor.specialization.toLowerCase().includes(specialization.toLowerCase()) ||
        advisor.expertise.some(exp => exp.toLowerCase().includes(specialization.toLowerCase()))
      );
    }
    
    if (maxFee) {
      advisors.advisors = advisors.advisors.filter(advisor => 
        advisor.consultationFee <= parseInt(maxFee)
      );
    }
    
    if (language) {
      advisors.advisors = advisors.advisors.filter(advisor => 
        advisor.languages.some(lang => lang.toLowerCase().includes(language.toLowerCase()))
      );
    }
    
    res.json({
      success: true,
      data: advisors,
      filters: { state, city, district, specialization, maxFee, language },
      message: `Found ${advisors.advisors.length} financial advisors`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching advisors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial advisors',
      error: error.message,
      fallback: 'Contact National Farmer Helpline: 1800-180-1551'
    });
  }
});

/**
 * Get specific advisor details
 * GET /api/debt-counseling/advisors/:advisorId
 */
router.get('/advisors/:advisorId', [
  param('advisorId').notEmpty().withMessage('Advisor ID is required')
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

    const { advisorId } = req.params;
    
    console.log(`👨‍💼 Fetching advisor details for ID: ${advisorId}`);
    
    // Get all advisors and find the specific one
    const allAdvisors = await debtCounselingService.getFinancialAdvisors({});
    const advisor = allAdvisors.advisors.find(a => a.id === advisorId);
    
    if (!advisor) {
      return res.status(404).json({
        success: false,
        message: 'Advisor not found',
        advisorId
      });
    }
    
    // Add additional real-time data
    const enhancedAdvisor = {
      ...advisor,
      currentStatus: advisor.isOnline ? 'Online' : 'Offline',
      nextAvailableSlot: advisor.todaySlots.length > 0 ? advisor.todaySlots[0] : 'Tomorrow',
      totalClientsHelped: Math.floor(Math.random() * 1000) + 200, // Simulated
      successRate: (85 + Math.random() * 10).toFixed(1) + '%', // Simulated
      averageResolutionTime: '3-5 business days',
      recentAchievements: [
        'Helped 50+ farmers with loan restructuring this quarter',
        'Successfully facilitated ₹2.5 Cr in agricultural loans',
        'Achieved 95% client satisfaction rating'
      ]
    };
    
    res.json({
      success: true,
      data: enhancedAdvisor,
      message: 'Advisor details retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching advisor details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advisor details',
      error: error.message
    });
  }
});

/**
 * Book consultation with an advisor
 * POST /api/debt-counseling/advisors/:advisorId/book
 */
router.post('/advisors/:advisorId/book', [
  param('advisorId').notEmpty().withMessage('Advisor ID is required'),
  body('farmerId').notEmpty().withMessage('Farmer ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('consultationType').isIn(['In-Person', 'Video Call', 'Phone Call', 'Home Visit']).withMessage('Valid consultation type is required'),
  body('topic').notEmpty().withMessage('Consultation topic is required'),
  body('urgency').optional().isIn(['Low', 'Normal', 'High', 'Emergency']).withMessage('Valid urgency level required'),
  body('farmerDetails').optional().isObject().withMessage('Farmer details must be an object')
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

    const { advisorId } = req.params;
    const { farmerId, date, time, consultationType, topic, urgency, farmerDetails } = req.body;
    
    console.log(`📅 Booking consultation with advisor ${advisorId} for farmer ${farmerId}`);
    
    const consultationDetails = {
      date,
      time,
      consultationType,
      topic,
      urgency: urgency || 'Normal'
    };
    
    const booking = await debtCounselingService.bookConsultation(advisorId, farmerId, consultationDetails);
    
    if (booking.success) {
      res.status(201).json({
        success: true,
        data: booking,
        message: 'Consultation booked successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        message: booking.error || 'Failed to book consultation',
        supportContact: '1800-180-1551'
      });
    }

  } catch (error) {
    console.error('❌ Error booking consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book consultation',
      error: error.message,
      supportContact: '1800-180-1551'
    });
  }
});

/**
 * Get available time slots for an advisor
 * GET /api/debt-counseling/advisors/:advisorId/slots
 */
router.get('/advisors/:advisorId/slots', [
  param('advisorId').notEmpty().withMessage('Advisor ID is required'),
  query('date').optional().isISO8601().withMessage('Valid date required for specific day slots'),
  query('days').optional().isNumeric().withMessage('Number of days must be numeric')
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

    const { advisorId } = req.params;
    const { date, days = 7 } = req.query;
    
    console.log(`📅 Fetching available slots for advisor ${advisorId}`);
    
    // Get advisor details first
    const allAdvisors = await debtCounselingService.getFinancialAdvisors({});
    const advisor = allAdvisors.advisors.find(a => a.id === advisorId);
    
    if (!advisor) {
      return res.status(404).json({
        success: false,
        message: 'Advisor not found'
      });
    }
    
    // Generate available slots for multiple days (simulated)
    const availableSlots = [];
    const startDate = date ? new Date(date) : new Date();
    
    for (let i = 0; i < parseInt(days); i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0; // Sunday
      
      // Skip if Sunday and advisor doesn't work on Sunday
      if (isWeekend && advisor.workingHours.sunday === 'Closed') {
        continue;
      }
      
      // Generate slots for this day
      const daySlots = [];
      const workingHours = isWeekend ? advisor.workingHours.sunday : 
                          dayOfWeek === 6 ? advisor.workingHours.saturday : 
                          advisor.workingHours.weekdays;
      
      if (workingHours !== 'Closed') {
        // Parse working hours and generate slots
        const slots = ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        slots.forEach(slot => {
          if (Math.random() > 0.3) { // 70% availability
            daySlots.push({
              time: slot,
              duration: '60 minutes',
              type: advisor.consultationTypes,
              fee: advisor.consultationFee
            });
          }
        });
      }
      
      availableSlots.push({
        date: currentDate.toISOString().split('T')[0],
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        slots: daySlots,
        totalSlots: daySlots.length
      });
    }
    
    res.json({
      success: true,
      data: {
        advisor: {
          id: advisor.id,
          name: advisor.name,
          consultationFee: advisor.consultationFee,
          consultationTypes: advisor.consultationTypes
        },
        availableSlots,
        totalDays: availableSlots.length,
        totalAvailableSlots: availableSlots.reduce((sum, day) => sum + day.totalSlots, 0)
      },
      message: 'Available slots retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: error.message
    });
  }
});

module.exports = router;
