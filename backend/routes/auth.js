const express = require('express');
const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');
const { extractDeviceInfo, authenticate } = require('../middleware/auth');

const router = express.Router();

// Language mapping for user-friendly names to codes
const languageMapping = {
  'English': 'en',
  'Hindi': 'hi', 
  'हिन्दी': 'hi',
  'Telugu': 'te',
  'తెలుగు': 'te', 
  'Tamil': 'ta',
  'தமிழ்': 'ta',
  'Kannada': 'kn',
  'ಕನ್ನಡ': 'kn',
  'Marathi': 'mr',
  'मराठी': 'mr',
  'Gujarati': 'gu',
  'ગુજરાતી': 'gu',
  'Punjabi': 'pa',
  'ਪੰਜਾਬੀ': 'pa',
  'Bengali': 'bn',
  'বাংলা': 'bn',
  'Odia': 'or',
  'ଓଡ଼ିଆ': 'or',
  'Assamese': 'as',
  'অসমীয়া': 'as',
  'Urdu': 'ur',
  'اردو': 'ur'
};

// Validation rules
const registerValidation = [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters'),
  body('lastName').optional().trim().isLength({ max: 50 }).withMessage('Last name must be less than 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6, max: 128 }).withMessage('Password must be between 6-128 characters'),
  body('phoneNumber').optional().custom((value) => {
    // Allow empty/null phone numbers
    if (!value || value.trim() === '') {
      return true;
    }
    // More flexible phone validation for Indian numbers
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    if (!phoneRegex.test(value)) {
      throw new Error('Please enter a valid phone number');
    }
    return true;
  }),
  body('preferredLanguage').optional().custom((value) => {
    if (!value) return true;
    
    // Check if it's already a valid language code
    const validCodes = ['en', 'hi', 'te', 'ta', 'kn', 'mr', 'gu', 'pa', 'bn', 'or', 'as', 'ur'];
    if (validCodes.includes(value.toLowerCase())) {
      return true;
    }
    
    // Check if it's a language name that can be mapped to a code
    if (languageMapping[value]) {
      return true;
    }
    
    throw new Error('Please select a valid language');
  })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register new user
router.post('/register', extractDeviceInfo, registerValidation, async (req, res) => {
  try {
    // Log incoming request data for debugging
    console.log('📝 Registration attempt:', {
      body: req.body,
      headers: req.headers['content-type']
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Registration validation failed. Please check the following fields:',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }

    const userData = req.body;
    
    // Convert language name to code if needed
    if (userData.preferredLanguage && languageMapping[userData.preferredLanguage]) {
      userData.preferredLanguage = languageMapping[userData.preferredLanguage];
    }
    
    // Convert language code to lowercase for consistency
    if (userData.preferredLanguage) {
      userData.preferredLanguage = userData.preferredLanguage.toLowerCase();
    }

    const result = await authService.registerUser(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        token: result.session.token,
        expiresAt: result.session.expiresAt,
        language: result.language
      }
    });
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    
    // Handle specific database errors
    if (error.message.includes('email') && error.message.includes('unique')) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please use a different email or try logging in.',
        field: 'email'
      });
    }
    
    if (error.message.includes('phone') && error.message.includes('unique')) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists. Please use a different phone number.',
        field: 'phoneNumber'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed. Please try again.'
    });
  }
});

// Login user
router.post('/login', extractDeviceInfo, loginValidation, async (req, res) => {
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

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password, req.deviceInfo);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.session.token,
        expiresAt: result.session.expiresAt,
        language: result.language
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await authService.logoutUser(token);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Verify session
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const result = await authService.verifySession(token);

    res.json({
      success: true,
      message: 'Session valid',
      data: {
        user: result.user,
        language: result.language
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Update language preference
router.put('/language', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const sessionData = await authService.verifySession(token);
    const { languageCode } = req.body;

    if (!languageCode) {
      return res.status(400).json({
        success: false,
        message: 'Language code is required'
      });
    }

    const language = await authService.updateUserLanguage(sessionData.user.id, languageCode);

    res.json({
      success: true,
      message: 'Language preference updated',
      data: { language }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get supported languages
router.get('/languages', async (req, res) => {
  try {
    const languages = await authService.getSupportedLanguages();

    res.json({
      success: true,
      message: 'Supported languages retrieved',
      data: { languages }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
