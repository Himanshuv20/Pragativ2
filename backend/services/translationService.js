const { Translate } = require('@google-cloud/translate').v2;
const NodeCache = require('node-cache');

class TranslationService {
    constructor() {
        // Cache for storing translations (1 hour TTL)
        this.translationCache = new NodeCache({ stdTTL: 3600 });
        
        // Initialize Google Translate client with API key support
        const translateConfig = {};
        
        // Check for API key first (simpler setup)
        if (process.env.GOOGLE_TRANSLATE_API_KEY && process.env.GOOGLE_TRANSLATE_API_KEY !== 'your_google_translate_api_key_here') {
            translateConfig.key = process.env.GOOGLE_TRANSLATE_API_KEY;
            console.log('🔑 Using Google Translate API Key for authentication');
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Service account key file will be automatically loaded
            console.log('🔑 Using Google Application Credentials for authentication');
        } else {
            console.warn('⚠️ No Google Cloud credentials found. Translation will use fallback mode.');
        }
        
        this.googleTranslate = new Translate(translateConfig);
        
        // Supported Indian languages with their codes
        this.supportedLanguages = {
            'hi': 'Hindi',
            'mr': 'Marathi', 
            'te': 'Telugu',
            'bn': 'Bengali',
            'ta': 'Tamil',
            'gu': 'Gujarati',
            'kn': 'Kannada',
            'ml': 'Malayalam',
            'pa': 'Punjabi',
            'or': 'Odia',
            'as': 'Assamese',
            'ur': 'Urdu'
        };

        console.log('🌐 Translation Service initialized with Google Translate support');
        console.log('📝 Supported languages:', Object.keys(this.supportedLanguages).join(', '));
    }

    /**
     * Check if Google Cloud credentials are properly configured
     */
    hasValidCredentials() {
        return (process.env.GOOGLE_TRANSLATE_API_KEY && process.env.GOOGLE_TRANSLATE_API_KEY !== 'your_google_translate_api_key_here') || 
               !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    /**
     * Main translation function using Google Translate
     */
    async translateToIndianLanguage(text, targetLangCode, options = {}) {
        try {
            // Validate language code
            if (!this.supportedLanguages[targetLangCode]) {
                throw new Error(`Unsupported language code: ${targetLangCode}. Supported: ${Object.keys(this.supportedLanguages).join(', ')}`);
            }

            // Return original text if target is English
            if (targetLangCode === 'en') {
                return text;
            }

            // Check cache first
            const cacheKey = `${text}_${targetLangCode}`;
            const cachedTranslation = this.translationCache.get(cacheKey);
            if (cachedTranslation && !options.forceRefresh) {
                console.log(`📋 Using cached translation for: ${text.substring(0, 50)}...`);
                return cachedTranslation;
            }

            // Perform translation using Google Translate
            const translation = await this._performGoogleTranslation(text, targetLangCode, options);

            // Cache the result
            this.translationCache.set(cacheKey, translation);

            return translation;

        } catch (error) {
            console.error('Translation error:', error);
            
            // Fallback to original text with error logging
            console.warn(`⚠️ Translation failed for "${text}" to ${targetLangCode}, returning original text`);
            return text;
        }
    }

    /**
     * Perform the actual translation using Google Translate API
     */
    async _performGoogleTranslation(text, targetLangCode, options = {}) {
        try {
            // Check if credentials are configured
            if (!this.hasValidCredentials()) {
                console.warn(`⚠️ Google Cloud credentials not configured. Add GOOGLE_TRANSLATE_API_KEY to .env file`);
                throw new Error('Google Cloud credentials not configured');
            }

            console.log(`🔄 Translating "${text.substring(0, 50)}..." to ${this.supportedLanguages[targetLangCode]} using Google Translate`);

            // Call Google Translate API
            const [translation] = await this.googleTranslate.translate(text, {
                from: 'en',
                to: targetLangCode,
                format: 'text'
            });

            console.log(`✅ Translation completed: "${translation.substring(0, 50)}..."`);
            return translation;

        } catch (error) {
            console.error(`❌ Google Translate API error:`, error);
            throw new Error(`Google Translate failed: ${error.message}`);
        }
    }

    /**
     * Batch translation for multiple texts
     */
    async translateBatch(texts, targetLangCode, options = {}) {
        try {
            console.log(`🔄 Batch translating ${texts.length} texts to ${this.supportedLanguages[targetLangCode]} using Google Translate`);
            
            const translations = await Promise.allSettled(
                texts.map(text => this.translateToIndianLanguage(text, targetLangCode, options))
            );

            return translations.map((result, index) => {
                if (result.status === 'fulfilled') {
                    return result.value;
                } else {
                    console.error(`Batch translation failed for text ${index}:`, result.reason);
                    return texts[index]; // Return original text on failure
                }
            });

        } catch (error) {
            console.error('Batch translation error:', error);
            return texts; // Return original texts on complete failure
        }
    }

    /**
     * Translate agricultural terms with domain-specific handling
     */
    async translateAgriculturalTerms(terms, targetLangCode) {
        // Agricultural term mappings for better accuracy
        const agricultureTermMappings = {
            'hi': {
                'crop': 'फसल',
                'farming': 'खेती',
                'soil': 'मिट्टी',
                'fertilizer': 'उर्वरक',
                'irrigation': 'सिंचाई',
                'harvest': 'फसल कटाई',
                'planting': 'बुआई',
                'weather': 'मौसम',
                'market': 'बाजार',
                'mandi': 'मंडी'
            },
            'mr': {
                'crop': 'पीक',
                'farming': 'शेती',
                'soil': 'माती',
                'fertilizer': 'खत',
                'irrigation': 'सिंचन',
                'harvest': 'कापणी',
                'planting': 'लागवड',
                'weather': 'हवामान',
                'market': 'बाजार',
                'mandi': 'मंडी'
            },
            'te': {
                'crop': 'పంట',
                'farming': 'వ్యవసాయం',
                'soil': 'మట్టి',
                'fertilizer': 'ఎరువు',
                'irrigation': 'నీటిపారుదల',
                'harvest': 'కోత',
                'planting': 'నాట్టం',
                'weather': 'వాతావరణం',
                'market': 'మార్కెట్',
                'mandi': 'మండి'
            }
        };

        const translations = [];
        for (const term of terms) {
            // Check if we have a pre-mapped term
            const lowerTerm = term.toLowerCase();
            if (agricultureTermMappings[targetLangCode] && 
                agricultureTermMappings[targetLangCode][lowerTerm]) {
                translations.push(agricultureTermMappings[targetLangCode][lowerTerm]);
            } else {
                // Use model translation
                const translation = await this.translateToIndianLanguage(term, targetLangCode);
                translations.push(translation);
            }
        }

        return translations;
    }

    /**
     * Get available languages
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * Check if a language is supported
     */
    isLanguageSupported(langCode) {
        return this.supportedLanguages.hasOwnProperty(langCode);
    }

    /**
     * Clear translation cache
     */
    clearCache() {
        this.translationCache.flushAll();
        console.log('🗑️ Translation cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            keys: this.translationCache.keys().length,
            hits: this.translationCache.getStats().hits,
            misses: this.translationCache.getStats().misses
        };
    }

    /**
     * Preload models for commonly used languages
     */
    async preloadCommonLanguages(languages = ['hi', 'mr', 'te']) {
        console.log('🚀 Preloading common language models...');
        
        const preloadPromises = languages
            .filter(lang => this.isLanguageSupported(lang))
            .map(lang => this.initializeModel(lang).catch(error => {
                console.warn(`Failed to preload ${lang}:`, error.message);
            }));

        await Promise.allSettled(preloadPromises);
        console.log('✅ Common language models preloading completed');
    }

    /**
     * Translate response with metadata preservation
     */
    async translateResponse(response, targetLangCode) {
        if (typeof response === 'string') {
            return await this.translateToIndianLanguage(response, targetLangCode);
        }

        if (typeof response === 'object' && response !== null) {
            const translatedResponse = { ...response };
            
            // Translate common response fields
            const fieldsToTranslate = ['message', 'response', 'text', 'title', 'description'];
            
            for (const field of fieldsToTranslate) {
                if (response[field] && typeof response[field] === 'string') {
                    translatedResponse[field] = await this.translateToIndianLanguage(
                        response[field], 
                        targetLangCode
                    );
                }
            }

            // Translate suggestions array
            if (response.suggestions && Array.isArray(response.suggestions)) {
                translatedResponse.suggestions = await this.translateBatch(
                    response.suggestions, 
                    targetLangCode
                );
            }

            return translatedResponse;
        }

        return response;
    }
}

module.exports = new TranslationService();
