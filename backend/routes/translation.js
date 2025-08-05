const express = require('express');
const router = express.Router();
const translationService = require('../services/translationService');
const chatbotService = require('../services/chatbotService');

/**
 * Get available languages
 */
router.get('/languages', async (req, res) => {
    try {
        const languages = chatbotService.getAvailableLanguages();
        res.json({
            success: true,
            languages: languages,
            default: 'en'
        });
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch available languages'
        });
    }
});

/**
 * Check translation service status and credentials
 */
router.get('/status', async (req, res) => {
    try {
        const hasCredentials = translationService.hasValidCredentials();
        res.json({
            success: true,
            status: hasCredentials ? 'ready' : 'credentials_missing',
            googleTranslateConfigured: hasCredentials,
            supportedLanguages: translationService.getSupportedLanguages(),
            message: hasCredentials ? 
                'Google Translate is ready to use' : 
                'Google Cloud credentials not configured. Add GOOGLE_TRANSLATE_API_KEY to your .env file'
        });
    } catch (error) {
        console.error('Error checking translation status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check translation service status'
        });
    }
});

/**
 * Translate text to Indian language
 */
router.post('/translate', async (req, res) => {
    try {
        const { text, targetLanguage, batch = false } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({
                success: false,
                error: 'Text and target language are required'
            });
        }

        if (!translationService.isLanguageSupported(targetLanguage) && targetLanguage !== 'en') {
            return res.status(400).json({
                success: false,
                error: `Unsupported language: ${targetLanguage}`,
                supportedLanguages: translationService.getSupportedLanguages()
            });
        }

        let translation;
        if (batch && Array.isArray(text)) {
            translation = await translationService.translateBatch(text, targetLanguage);
        } else {
            translation = await translationService.translateToIndianLanguage(text, targetLanguage);
        }

        res.json({
            success: true,
            originalText: text,
            translatedText: translation,
            sourceLanguage: 'en',
            targetLanguage: targetLanguage,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({
            success: false,
            error: 'Translation failed',
            details: error.message
        });
    }
});

/**
 * Translate agricultural terms
 */
router.post('/translate-agricultural', async (req, res) => {
    try {
        const { terms, targetLanguage } = req.body;

        if (!terms || !targetLanguage) {
            return res.status(400).json({
                success: false,
                error: 'Terms and target language are required'
            });
        }

        if (!Array.isArray(terms)) {
            return res.status(400).json({
                success: false,
                error: 'Terms must be an array'
            });
        }

        const translations = await translationService.translateAgriculturalTerms(terms, targetLanguage);

        res.json({
            success: true,
            originalTerms: terms,
            translatedTerms: translations,
            targetLanguage: targetLanguage,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Agricultural translation error:', error);
        res.status(500).json({
            success: false,
            error: 'Agricultural translation failed',
            details: error.message
        });
    }
});

/**
 * Set user language preference
 */
router.post('/user-language', async (req, res) => {
    try {
        const { userId, language } = req.body;

        if (!userId || !language) {
            return res.status(400).json({
                success: false,
                error: 'User ID and language are required'
            });
        }

        const success = chatbotService.setUserLanguage(userId, language);
        
        if (success) {
            res.json({
                success: true,
                message: 'Language preference updated successfully',
                userId: userId,
                language: language
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Unsupported language',
                supportedLanguages: chatbotService.getAvailableLanguages()
            });
        }

    } catch (error) {
        console.error('Language preference error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update language preference'
        });
    }
});

/**
 * Get user language preference
 */
router.get('/user-language/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const language = chatbotService.getUserLanguage(userId);

        res.json({
            success: true,
            userId: userId,
            language: language,
            languageName: chatbotService.getAvailableLanguages()[language]
        });

    } catch (error) {
        console.error('Get language preference error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get language preference'
        });
    }
});

/**
 * Preload common language models
 */
router.post('/preload-models', async (req, res) => {
    try {
        const { languages = ['hi', 'mr', 'te'] } = req.body;
        
        // Start preloading in background
        translationService.preloadCommonLanguages(languages)
            .then(() => {
                console.log('✅ Models preloaded successfully');
            })
            .catch(error => {
                console.error('❌ Model preloading failed:', error);
            });

        res.json({
            success: true,
            message: 'Model preloading started',
            languages: languages
        });

    } catch (error) {
        console.error('Model preload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to start model preloading'
        });
    }
});

/**
 * Get translation cache statistics
 */
router.get('/cache-stats', async (req, res) => {
    try {
        const stats = translationService.getCacheStats();
        
        res.json({
            success: true,
            cacheStats: stats
        });

    } catch (error) {
        console.error('Cache stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get cache statistics'
        });
    }
});

/**
 * Clear translation cache
 */
router.post('/clear-cache', async (req, res) => {
    try {
        translationService.clearCache();
        
        res.json({
            success: true,
            message: 'Translation cache cleared successfully'
        });

    } catch (error) {
        console.error('Clear cache error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cache'
        });
    }
});

module.exports = router;
