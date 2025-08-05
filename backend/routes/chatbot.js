const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbotService');
const { body, validationResult } = require('express-validator');

/**
 * POST /api/chatbot/message
 * Process a user message through the chatbot
 */
router.post('/message', [
    body('message').notEmpty().withMessage('Message is required'),
    body('userId').optional().isString(),
    body('context').optional().isObject(),
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid input',
                details: errors.array()
            });
        }

        const { message, userId = 'anonymous', context = {} } = req.body;

        // Process the message through the chatbot service
        const response = await chatbotService.processMessage(userId, message, context);

        res.json(response);

    } catch (error) {
        console.error('Chatbot API error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Unable to process your message at this time'
        });
    }
});

/**
 * GET /api/chatbot/conversation/:userId
 * Get conversation history for a user
 */
router.get('/conversation/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const history = chatbotService.getConversationHistory(userId);
        
        res.json({
            success: true,
            userId,
            history,
            count: history.length
        });

    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to retrieve conversation history'
        });
    }
});

/**
 * DELETE /api/chatbot/conversation/:userId
 * Clear conversation history for a user
 */
router.delete('/conversation/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = chatbotService.clearConversation(userId);
        
        res.json({
            success: true,
            message: `Conversation cleared for user ${userId}`
        });

    } catch (error) {
        console.error('Clear conversation error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to clear conversation history'
        });
    }
});

/**
 * POST /api/chatbot/context
 * Update user context (location, preferences, etc.)
 */
router.post('/context', [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('context').isObject().withMessage('Context must be an object'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid input',
                details: errors.array()
            });
        }

        const { userId, context } = req.body;

        // In a real implementation, you might store this in a database
        // For now, we'll just return success
        res.json({
            success: true,
            message: 'Context updated successfully',
            userId,
            context
        });

    } catch (error) {
        console.error('Update context error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to update context'
        });
    }
});

/**
 * GET /api/chatbot/intents
 * Get available intents and their descriptions
 */
router.get('/intents', (req, res) => {
    try {
        const intents = {
            crop_calendar: {
                description: 'Get crop planting and harvesting schedules',
                examples: ['When should I plant wheat?', 'Show me crop calendar for rice'],
                requiredContext: ['location', 'crop']
            },
            weather: {
                description: 'Get weather forecasts and climate information',
                examples: ['What\'s the weather like?', 'Rain forecast for next week'],
                requiredContext: ['location']
            },
            mandi_prices: {
                description: 'Get current market prices for crops',
                examples: ['What are potato prices?', 'Mandi rates for wheat'],
                requiredContext: ['location']
            },
            soil_analysis: {
                description: 'Get soil health and analysis information',
                examples: ['Check my soil health', 'Soil analysis for tomatoes'],
                requiredContext: ['location']
            },
            pest_disease: {
                description: 'Identify and treat plant diseases and pests',
                examples: ['What\'s wrong with my plants?', 'Identify this disease'],
                requiredContext: ['image']
            },
            government_schemes: {
                description: 'Find relevant government schemes and subsidies',
                examples: ['What schemes are available?', 'Government support for farmers'],
                requiredContext: []
            },
            sustainable_practices: {
                description: 'Learn about organic and sustainable farming',
                examples: ['Organic farming tips', 'Sustainable agriculture practices'],
                requiredContext: []
            },
            emergency: {
                description: 'Get emergency agricultural support',
                examples: ['My crops are dying', 'Emergency help needed'],
                requiredContext: ['location']
            }
        };

        res.json({
            success: true,
            intents
        });

    } catch (error) {
        console.error('Get intents error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to retrieve intents'
        });
    }
});

/**
 * POST /api/chatbot/feedback
 * Collect user feedback on chatbot responses
 */
router.post('/feedback', [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('messageId').optional().isString(),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('feedback').optional().isString(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid input',
                details: errors.array()
            });
        }

        const { userId, messageId, rating, feedback } = req.body;

        // In a real implementation, you would store this feedback in a database
        console.log('Chatbot feedback received:', { userId, messageId, rating, feedback });

        res.json({
            success: true,
            message: 'Thank you for your feedback!',
            userId,
            rating
        });

    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to process feedback'
        });
    }
});

module.exports = router;
