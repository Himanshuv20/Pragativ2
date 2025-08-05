const authService = require('../services/authService');

// Middleware to verify authentication
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const sessionData = await authService.verifySession(token);
    
    // Attach user data to request
    req.user = sessionData.user;
    req.language = sessionData.language;
    req.session = sessionData.session;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Middleware to extract device info
const extractDeviceInfo = (req, res, next) => {
  req.deviceInfo = {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    browser: req.headers['user-agent'],
    timestamp: new Date()
  };
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const sessionData = await authService.verifySession(token);
      req.user = sessionData.user;
      req.language = sessionData.language;
      req.session = sessionData.session;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  extractDeviceInfo,
  optionalAuth
};
