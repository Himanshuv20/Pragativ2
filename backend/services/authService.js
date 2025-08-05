const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, Language, UserSession } = require('../models');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key';
    this.tokenExpiration = process.env.TOKEN_EXPIRATION || '24h';
  }

  // Register a new user
  async registerUser(userData) {
    try {
      const { firstName, lastName, email, password, phoneNumber, preferredLanguage } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Get language ID
      let preferredLanguageId = 1; // Default to English
      if (preferredLanguage) {
        const language = await Language.findOne({ where: { code: preferredLanguage } });
        if (language) {
          preferredLanguageId = language.id;
        }
      }

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        passwordHash,
        preferredLanguageId
      });

      // Create session
      const sessionData = await this.createSession(user, {});

      return {
        user: this.sanitizeUser(user),
        session: sessionData,
        language: await this.getUserLanguage(user.preferredLanguageId)
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user
  async loginUser(email, password, deviceInfo = {}) {
    try {
      // Find user with language
      const user = await User.findOne({
        where: { email, isActive: true },
        include: [{ model: Language, as: 'preferredLanguage' }]
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      // Create session
      const sessionData = await this.createSession(user, deviceInfo);

      return {
        user: this.sanitizeUser(user),
        session: sessionData,
        language: user.preferredLanguage || await this.getUserLanguage(user.preferredLanguageId)
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Create user session
  async createSession(user, deviceInfo) {
    try {
      // Generate session token
      const sessionToken = jwt.sign(
        { userId: user.id, email: user.email },
        this.jwtSecret,
        { expiresIn: this.tokenExpiration }
      );

      // Calculate expiration time
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

      // Save session to database
      const session = await UserSession.create({
        userId: user.id,
        sessionToken,
        deviceInfo,
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        expiresAt
      });

      return {
        token: sessionToken,
        expiresAt,
        sessionId: session.id
      };
    } catch (error) {
      throw new Error(`Session creation failed: ${error.message}`);
    }
  }

  // Verify session token
  async verifySession(token) {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, this.jwtSecret);

      // Find session in database
      const session = await UserSession.findOne({
        where: {
          sessionToken: token,
          isActive: true,
          expiresAt: { [require('sequelize').Op.gt]: new Date() }
        },
        include: [{
          model: User,
          as: 'user',
          where: { isActive: true },
          include: [{ model: Language, as: 'preferredLanguage' }]
        }]
      });

      if (!session) {
        throw new Error('Invalid or expired session');
      }

      // Update last activity
      await session.update({ lastActivityAt: new Date() });

      return {
        user: this.sanitizeUser(session.user),
        session: {
          id: session.id,
          expiresAt: session.expiresAt
        },
        language: session.user.preferredLanguage || await this.getUserLanguage(session.user.preferredLanguageId)
      };
    } catch (error) {
      throw new Error(`Session verification failed: ${error.message}`);
    }
  }

  // Logout user
  async logoutUser(token) {
    try {
      await UserSession.update(
        { isActive: false },
        { where: { sessionToken: token } }
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  // Update user language preference
  async updateUserLanguage(userId, languageCode) {
    try {
      const language = await Language.findOne({ where: { code: languageCode } });
      if (!language) {
        throw new Error('Language not supported');
      }

      await User.update(
        { preferredLanguageId: language.id },
        { where: { id: userId } }
      );

      return language;
    } catch (error) {
      throw new Error(`Language update failed: ${error.message}`);
    }
  }

  // Get user language
  async getUserLanguage(languageId) {
    try {
      const language = await Language.findByPk(languageId);
      return language || await Language.findOne({ where: { code: 'en' } });
    } catch (error) {
      return await Language.findOne({ where: { code: 'en' } });
    }
  }

  // Get all supported languages
  async getSupportedLanguages() {
    try {
      return await Language.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']]
      });
    } catch (error) {
      throw new Error(`Failed to get languages: ${error.message}`);
    }
  }

  // Sanitize user data (remove sensitive fields)
  sanitizeUser(user) {
    const userData = user.toJSON ? user.toJSON() : user;
    delete userData.passwordHash;
    return userData;
  }

  // Cleanup expired sessions
  async cleanupExpiredSessions() {
    try {
      const result = await UserSession.destroy({
        where: {
          expiresAt: { [require('sequelize').Op.lt]: new Date() }
        }
      });
      console.log(`✅ Cleaned up ${result} expired sessions`);
      return result;
    } catch (error) {
      console.error('❌ Session cleanup failed:', error);
      return 0;
    }
  }
}

module.exports = new AuthService();
