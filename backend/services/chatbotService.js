const OpenAI = require('openai');
const cropCalendarService = require('./cropCalendarService');
const weatherService = require('./weatherService');
const satelliteDataService = require('./satelliteDataService');
const mandiDataService = require('./mandiDataService');
const soilAnalysisService = require('./soilAnalysisService');
const aiRecommendationService = require('./aiRecommendationService');
const governmentSchemesService = require('./governmentSchemesService');
const sustainablePracticesService = require('./sustainablePracticesService');
const sosEmergencyService = require('./sosEmergencyService');
const translationService = require('./translationService');

class ChatbotService {
    constructor() {
        // Initialize OpenAI client (fallback to mock if no API key)
        this.openai = process.env.OPENAI_API_KEY 
            ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
            : null;
        
        // Conversation memory (in production, use Redis or database)
        this.conversationMemory = new Map();
        
        // User language preferences (in production, store in database)
        this.userLanguagePreferences = new Map();
        
        // Default language for new users
        this.defaultLanguage = 'en';
        
        // Intent classification patterns
        this.intentPatterns = {
            crop_calendar: [
                'crop calendar', 'planting schedule', 'when to plant', 'farming calendar',
                'crop planning', 'sowing time', 'harvest time', 'agricultural calendar'
            ],
            weather: [
                'weather', 'forecast', 'rain', 'temperature', 'climate',
                'weather prediction', 'meteorology', 'atmospheric conditions'
            ],
            mandi_prices: [
                'mandi price', 'market rate', 'crop price', 'selling price',
                'market data', 'commodity price', 'agricultural market'
            ],
            soil_analysis: [
                'soil test', 'soil analysis', 'soil health', 'ph level',
                'nutrient analysis', 'soil quality', 'soil condition'
            ],
            pest_disease: [
                'pest', 'disease', 'crop disease', 'plant disease', 'insect',
                'crop protection', 'plant health', 'disease identification'
            ],
            government_schemes: [
                'government scheme', 'subsidy', 'loan', 'financial help',
                'agricultural scheme', 'farmer scheme', 'government support'
            ],
            sustainable_practices: [
                'organic farming', 'sustainable', 'eco-friendly', 'green farming',
                'natural farming', 'sustainable agriculture', 'environment friendly'
            ],
            emergency: [
                'emergency', 'urgent', 'help', 'crisis', 'disaster', 'immediate'
            ]
        };
    }

    /**
     * Main chatbot processing function with language support
     */
    async processMessage(userId, message, context = {}) {
        try {
            // Get user's preferred language
            const userLanguage = context.language || this.getUserLanguage(userId);
            
            // Get or create conversation context
            const conversationId = userId;
            let conversation = this.conversationMemory.get(conversationId) || {
                history: [],
                context: {},
                language: userLanguage
            };

            // Check for language change commands
            const languageChange = this.detectLanguageChange(message);
            if (languageChange) {
                this.setUserLanguage(userId, languageChange.language);
                conversation.language = languageChange.language;
                
                const response = await translationService.translateToIndianLanguage(
                    `Language changed to ${translationService.getSupportedLanguages()[languageChange.language]}. How can I help you with farming?`,
                    languageChange.language
                );
                
                return {
                    success: true,
                    response: response,
                    language: languageChange.language,
                    languageChanged: true,
                    suggestions: await this.getTranslatedSuggestions(['Crop calendar', 'Weather forecast', 'Market prices'], languageChange.language)
                };
            }

            // Add user message to history
            conversation.history.push({
                role: 'user',
                content: message,
                timestamp: new Date(),
                language: userLanguage
            });

            // Classify intent
            const intent = await this.classifyIntent(message, conversation);
            
            // Route to appropriate module
            const moduleResponse = await this.routeToModule(intent, message, context, conversation);
            
            // Generate conversational response
            const response = await this.generateResponse(intent, moduleResponse, message, conversation);
            
            // Translate response if needed
            const translatedResponse = userLanguage !== 'en' 
                ? await translationService.translateResponse(response, userLanguage)
                : response;
            
            // Add assistant response to history
            conversation.history.push({
                role: 'assistant',
                content: translatedResponse.text,
                intent: intent,
                moduleData: moduleResponse,
                timestamp: new Date(),
                language: userLanguage
            });

            // Update conversation memory (keep last 10 exchanges)
            if (conversation.history.length > 20) {
                conversation.history = conversation.history.slice(-20);
            }
            this.conversationMemory.set(conversationId, conversation);

            return {
                success: true,
                response: translatedResponse.text,
                intent: intent,
                conversationId: conversationId,
                suggestions: translatedResponse.suggestions || [],
                data: moduleResponse,
                language: userLanguage
            };

        } catch (error) {
            console.error('Chatbot processing error:', error);
            
            // Get user language for error message
            const userLanguage = context.language || this.getUserLanguage(userId);
            const errorMessage = "I'm sorry, I couldn't process your request right now. Could you please rephrase or try again?";
            
            const translatedError = userLanguage !== 'en' 
                ? await translationService.translateToIndianLanguage(errorMessage, userLanguage).catch(() => errorMessage)
                : errorMessage;
            
            return {
                success: false,
                error: 'I encountered an error processing your request. Please try again.',
                response: translatedError,
                language: userLanguage
            };
        }
    }

    /**
     * Classify user intent using LLM or pattern matching
     */
    async classifyIntent(message, conversation) {
        // First try LLM classification if available
        if (this.openai) {
            try {
                const completion = await this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are an agricultural assistant. Classify the user's intent into one of these categories:
                            - crop_calendar: Questions about planting, harvesting, crop schedules
                            - weather: Weather forecasts, climate information
                            - mandi_prices: Market prices, selling rates
                            - soil_analysis: Soil testing, soil health
                            - pest_disease: Plant diseases, pest identification
                            - government_schemes: Government support, subsidies
                            - sustainable_practices: Organic farming, eco-friendly methods
                            - emergency: Urgent agricultural problems
                            - general: General conversation or unclear intent
                            
                            Respond with only the category name.`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    max_tokens: 50,
                    temperature: 0.1
                });

                const intent = completion.choices[0].message.content.trim().toLowerCase();
                if (this.intentPatterns[intent]) {
                    return intent;
                }
            } catch (error) {
                console.error('OpenAI classification error:', error);
            }
        }

        // Fallback to pattern matching
        const msgLower = message.toLowerCase();
        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            if (patterns.some(pattern => msgLower.includes(pattern))) {
                return intent;
            }
        }

        return 'general';
    }

    /**
     * Route message to appropriate module based on intent
     */
    async routeToModule(intent, message, context, conversation) {
        try {
            switch (intent) {
                case 'crop_calendar':
                    return await this.handleCropCalendar(message, context);
                
                case 'weather':
                    return await this.handleWeather(message, context);
                
                case 'mandi_prices':
                    return await this.handleMandiPrices(message, context);
                
                case 'soil_analysis':
                    return await this.handleSoilAnalysis(message, context);
                
                case 'pest_disease':
                    return await this.handlePestDisease(message, context);
                
                case 'government_schemes':
                    return await this.handleGovernmentSchemes(message, context);
                
                case 'sustainable_practices':
                    return await this.handleSustainablePractices(message, context);
                
                case 'emergency':
                    return await this.handleEmergency(message, context);
                
                default:
                    return await this.handleGeneral(message, context);
            }
        } catch (error) {
            console.error(`Module routing error for intent ${intent}:`, error);
            return {
                error: true,
                message: 'Unable to process request with the specific module'
            };
        }
    }

    /**
     * Handle crop calendar requests with enhanced info extraction
     */
    async handleCropCalendar(message, context) {
        // Extract crop and location information from message
        const extractedInfo = this.extractCropCalendarInfo(message, context);
        
        if (extractedInfo.location && extractedInfo.crop) {
            try {
                const calendar = await cropCalendarService.generateCropCalendar({
                    location: extractedInfo.location,
                    crop: extractedInfo.crop,
                    area: extractedInfo.area || 1,
                    soilType: extractedInfo.soilType || 'loamy'
                });
                return { 
                    type: 'crop_calendar', 
                    data: calendar,
                    message: `Here's your crop calendar for ${extractedInfo.crop} farming. This includes planting schedules, fertilization times, and harvest periods optimized for your location.`,
                    extractedInfo: extractedInfo
                };
            } catch (error) {
                console.error('Crop calendar error:', error);
                return { error: true, message: 'Unable to generate crop calendar', details: error.message };
            }
        } else {
            // Provide immediate guidance based on what's available
            const suggestions = this.getCropCalendarSuggestions(extractedInfo);
            return {
                type: 'crop_calendar',
                needsInput: true,
                message: `I'd love to help you create a farming calendar! ${suggestions}`,
                missingInfo: {
                    location: !extractedInfo.location,
                    crop: !extractedInfo.crop
                },
                suggestions: ['Tell me your location', 'Which crop do you want to grow?', 'Share your area size']
            };
        }
    }

    /**
     * Handle weather requests with immediate data when possible
     */
    async handleWeather(message, context) {
        const extractedInfo = this.extractLocationInfo(message, context);
        
        if (extractedInfo.location) {
            try {
                const weather = await weatherService.getComprehensiveWeatherData(
                    extractedInfo.location.latitude || 28.6139, // Default to Delhi if no coords
                    extractedInfo.location.longitude || 77.2090,
                    extractedInfo.days || 7
                );
                return { 
                    type: 'weather', 
                    data: weather,
                    message: `Here's the weather forecast for your area. This will help you plan your farming activities.`,
                    location: extractedInfo.location
                };
            } catch (error) {
                console.error('Weather error:', error);
                return { error: true, message: 'Unable to fetch weather data', details: error.message };
            }
        } else {
            return {
                type: 'weather',
                needsInput: true,
                message: 'I can provide weather forecasts to help you plan your farming activities. Please share your location (city, state) or coordinates.',
                suggestions: ['Weather in Mumbai', 'Delhi weather forecast', 'Share my location']
            };
        }
    }

    /**
     * Handle mandi price requests with direct market data
     */
    async handleMandiPrices(message, context) {
        const extractedInfo = this.extractMandiInfo(message, context);
        
        try {
            let mandiData;
            if (extractedInfo.crop) {
                // Get prices for specific crop
                mandiData = await mandiDataService.getCropPrices(extractedInfo.crop);
                return { 
                    type: 'mandi_prices', 
                    data: mandiData,
                    message: `Here are the current ${extractedInfo.crop} prices from various mandis. This data is updated daily from government sources.`,
                    crop: extractedInfo.crop
                };
            } else {
                // Get general market data
                mandiData = await mandiDataService.getLatestPrices();
                return { 
                    type: 'mandi_prices', 
                    data: mandiData,
                    message: 'Here are the current market prices for various crops. This data helps you make informed selling decisions.'
                };
            }
        } catch (error) {
            console.error('Mandi prices error:', error);
            return { 
                error: true, 
                message: 'Unable to fetch mandi prices at the moment. Please try again later.',
                suggestions: ['Try specific crop like "wheat prices"', 'Ask for "market rates"']
            };
        }
    }

    /**
     * Handle soil analysis with immediate recommendations
     */
    async handleSoilAnalysis(message, context) {
        const extractedInfo = this.extractSoilInfo(message, context);
        
        try {
            const analysis = await soilAnalysisService.analyzeSoil({
                location: extractedInfo.location || { city: 'general' },
                crop: extractedInfo.crop,
                soilType: extractedInfo.soilType
            });
            return { 
                type: 'soil_analysis', 
                data: analysis,
                message: 'Based on your location and soil conditions, here are my recommendations for improving soil health and crop yield.',
                extractedInfo: extractedInfo
            };
        } catch (error) {
            console.error('Soil analysis error:', error);
            return {
                type: 'soil_analysis',
                needsInput: false,
                message: 'I can help analyze soil conditions and provide improvement recommendations. Here are some general tips for soil health.',
                suggestions: ['Soil health for wheat farming', 'pH levels for vegetables', 'Fertilizer recommendations'],
                data: {
                    recommendations: [
                        'Test soil pH regularly (ideal range: 6.0-7.5)',
                        'Add organic matter like compost or farmyard manure',
                        'Ensure proper drainage to prevent waterlogging',
                        'Use crop rotation to maintain soil fertility'
                    ]
                }
            };
        }
    }

    /**
     * Handle pest and disease with enhanced guidance
     */
    async handlePestDisease(message, context) {
        const extractedInfo = this.extractPestDiseaseInfo(message, context);
        
        try {
            // Provide immediate guidance based on described symptoms
            const guidance = this.getPestDiseaseGuidance(extractedInfo);
            return {
                type: 'pest_disease',
                data: guidance,
                message: 'Based on your description, here are some possible issues and solutions. For accurate diagnosis, consider visiting our pest analysis tool.',
                needsImage: false,
                suggestions: ['Upload plant photo', 'Describe more symptoms', 'Visit pest analysis tool']
            };
        } catch (error) {
            console.error('Pest disease error:', error);
            return { 
                error: true, 
                message: 'Unable to analyze pest/disease issue',
                suggestions: ['Try describing symptoms clearly', 'Upload a photo of affected plant']
            };
        }
    }

    /**
     * Handle government schemes with immediate results
     */
    async handleGovernmentSchemes(message, context) {
        const extractedInfo = this.extractSchemeInfo(message, context);
        
        try {
            const schemes = await governmentSchemesService.getEligibleSchemes({
                location: extractedInfo.location,
                farmerProfile: extractedInfo.farmerProfile || {},
                category: extractedInfo.category
            });
            return { 
                type: 'government_schemes', 
                data: schemes,
                message: 'Here are government schemes and subsidies available for farmers. These can help reduce costs and improve your farming operations.'
            };
        } catch (error) {
            console.error('Government schemes error:', error);
            return { 
                error: true, 
                message: 'Unable to fetch schemes at the moment',
                suggestions: ['Try asking for specific schemes like "loan schemes"', 'Ask about "farmer subsidies"']
            };
        }
    }

    /**
     * Handle sustainable practices
     */
    async handleSustainablePractices(message, context) {
        try {
            const practices = await sustainablePracticesService.getSustainablePractices({
                crop: context.crop,
                location: context.location
            });
            return { 
                type: 'sustainable_practices', 
                data: practices,
                message: 'Here are sustainable farming practices that can help improve your yield while protecting the environment.'
            };
        } catch (error) {
            console.error('Sustainable practices error:', error);
            return { 
                error: true, 
                message: 'Here are some general sustainable farming tips',
                data: {
                    practices: [
                        'Use organic fertilizers and compost',
                        'Practice crop rotation to maintain soil health',
                        'Implement water-efficient irrigation methods',
                        'Use biological pest control methods',
                        'Plant cover crops to prevent soil erosion'
                    ]
                }
            };
        }
    }

    /**
     * Handle emergency requests
     */
    async handleEmergency(message, context) {
        try {
            const emergency = await sosEmergencyService.handleEmergency({
                message: message,
                location: context.location
            });
            return { 
                type: 'emergency', 
                data: emergency,
                message: 'I understand this is urgent. Here are immediate steps and emergency contacts.'
            };
        } catch (error) {
            console.error('Emergency handling error:', error);
            return { 
                error: true, 
                message: 'For agricultural emergencies, contact your local agricultural extension office or call 1551 (Kisan Call Center)',
                data: {
                    contacts: [
                        'Kisan Call Center: 1551',
                        'Agricultural Extension Office',
                        'Local Veterinary Officer'
                    ]
                }
            };
        }
    }

    /**
     * Handle general queries
     */
    async handleGeneral(message, context) {
        return {
            type: 'general',
            message: 'I can help you with farming-related questions like crop calendars, weather, market prices, soil analysis, and more. How can I assist you today?',
            suggestions: ['Crop calendar', 'Weather forecast', 'Market prices', 'Soil analysis']
        };
    }

    /**
     * Extract crop calendar information from message
     */
    extractCropCalendarInfo(message, context) {
        const result = {
            location: context.location,
            crop: context.crop,
            area: context.area,
            soilType: context.soilType
        };

        // Extract crop names from message
        const crops = ['wheat', 'rice', 'maize', 'corn', 'tomato', 'potato', 'onion', 'cotton', 'sugarcane', 'soybean', 'chickpea', 'bajra', 'jowar'];
        for (const crop of crops) {
            if (message.toLowerCase().includes(crop)) {
                result.crop = crop;
                break;
            }
        }

        // Extract location information
        const locationMatch = message.match(/(?:in|at|near)\s+([A-Za-z\s,]+)/i);
        if (locationMatch) {
            result.location = { city: locationMatch[1].trim() };
        }

        // Extract area information
        const areaMatch = message.match(/(\d+(?:\.\d+)?)\s*(acre|hectare|ha)/i);
        if (areaMatch) {
            result.area = parseFloat(areaMatch[1]);
        }

        return result;
    }

    /**
     * Extract location information from message
     */
    extractLocationInfo(message, context) {
        const result = {
            location: context.location,
            days: context.days
        };

        // Extract location
        const locationMatch = message.match(/(?:in|at|near|for)\s+([A-Za-z\s,]+)/i);
        if (locationMatch) {
            result.location = { city: locationMatch[1].trim() };
        }

        // Extract days for forecast
        const daysMatch = message.match(/(\d+)\s*day/i);
        if (daysMatch) {
            result.days = parseInt(daysMatch[1]);
        }

        return result;
    }

    /**
     * Extract mandi/market information from message
     */
    extractMandiInfo(message, context) {
        const result = {
            location: context.location,
            crop: context.crop,
            radius: context.radius
        };

        // Extract crop names
        const crops = ['wheat', 'rice', 'maize', 'corn', 'tomato', 'potato', 'onion', 'cotton', 'sugarcane', 'soybean', 'chickpea', 'bajra', 'jowar'];
        for (const crop of crops) {
            if (message.toLowerCase().includes(crop)) {
                result.crop = crop;
                break;
            }
        }

        // Extract location
        const locationMatch = message.match(/(?:in|at|near)\s+([A-Za-z\s,]+)/i);
        if (locationMatch) {
            result.location = { city: locationMatch[1].trim() };
        }

        return result;
    }

    /**
     * Extract soil analysis information from message
     */
    extractSoilInfo(message, context) {
        const result = {
            location: context.location,
            crop: context.crop,
            soilType: context.soilType
        };

        // Extract soil types
        const soilTypes = ['clay', 'sandy', 'loamy', 'silt', 'red', 'black', 'alluvial'];
        for (const soil of soilTypes) {
            if (message.toLowerCase().includes(soil)) {
                result.soilType = soil;
                break;
            }
        }

        // Extract crop names
        const crops = ['wheat', 'rice', 'maize', 'tomato', 'potato', 'onion', 'cotton', 'sugarcane', 'soybean', 'chickpea'];
        for (const crop of crops) {
            if (message.toLowerCase().includes(crop)) {
                result.crop = crop;
                break;
            }
        }

        // Extract location
        const locationMatch = message.match(/(?:in|at|near)\s+([A-Za-z\s,]+)/i);
        if (locationMatch) {
            result.location = { city: locationMatch[1].trim() };
        }

        return result;
    }

    /**
     * Extract pest/disease information from message
     */
    extractPestDiseaseInfo(message, context) {
        const result = {
            symptoms: [],
            pestName: null,
            crop: context.crop
        };

        // Common symptoms
        const symptoms = {
            'yellow leaves': 'yellowing',
            'brown spots': 'brown_spots',
            'white powder': 'white_powder',
            'holes in leaves': 'holes',
            'wilting': 'wilting',
            'curled leaves': 'curling'
        };

        for (const [symptom, code] of Object.entries(symptoms)) {
            if (message.toLowerCase().includes(symptom)) {
                result.symptoms.push(code);
            }
        }

        // Common pests
        const pests = ['aphid', 'caterpillar', 'spider mite', 'whitefly', 'thrips'];
        for (const pest of pests) {
            if (message.toLowerCase().includes(pest)) {
                result.pestName = pest;
                break;
            }
        }

        return result;
    }

    /**
     * Extract government scheme information from message
     */
    extractSchemeInfo(message, context) {
        const result = {
            location: context.location,
            farmerProfile: context.farmerProfile || {},
            category: null
        };

        // Scheme categories
        const categories = ['loan', 'subsidy', 'insurance', 'seed', 'fertilizer', 'equipment'];
        for (const category of categories) {
            if (message.toLowerCase().includes(category)) {
                result.category = category;
                break;
            }
        }

        return result;
    }

    /**
     * Get crop calendar suggestions based on available info
     */
    getCropCalendarSuggestions(info) {
        const suggestions = [];
        if (!info.location) suggestions.push('Please tell me your location (city, state)');
        if (!info.crop) suggestions.push('Which crop do you want to grow?');
        return suggestions.join(' and ');
    }

    /**
     * Get pest/disease guidance based on symptoms
     */
    getPestDiseaseGuidance(info) {
        const guidance = {
            symptoms: info.symptoms,
            possibleIssues: [],
            solutions: []
        };

        if (info.symptoms.includes('yellowing')) {
            guidance.possibleIssues.push('Nutrient deficiency or overwatering');
            guidance.solutions.push('Check soil drainage and apply balanced fertilizer');
        }

        if (info.symptoms.includes('holes')) {
            guidance.possibleIssues.push('Caterpillar or beetle damage');
            guidance.solutions.push('Use organic insecticides or neem oil');
        }

        if (info.symptoms.includes('brown_spots')) {
            guidance.possibleIssues.push('Fungal disease');
            guidance.solutions.push('Apply fungicide and improve air circulation');
        }

        if (guidance.possibleIssues.length === 0) {
            guidance.possibleIssues.push('General plant stress');
            guidance.solutions.push('Ensure proper watering, nutrition, and sunlight');
        }

        return guidance;
    }

    /**
     * Generate conversational response based on module output
     */
    async generateResponse(intent, moduleResponse, message, conversation) {
        try {
            if (moduleResponse.error) {
                return {
                    text: moduleResponse.message || "I'm having trouble processing that request right now. Please try again.",
                    suggestions: moduleResponse.suggestions || ['Try rephrasing your question', 'Ask about something else']
                };
            }

            let responseText = moduleResponse.message || 'Here\'s what I found for you.';
            
            // Add specific suggestions based on intent and data
            let suggestions = moduleResponse.suggestions || [];
            
            if (intent === 'crop_calendar' && moduleResponse.data) {
                suggestions = ['Get weather forecast', 'Check soil health', 'Find market prices'];
            } else if (intent === 'weather' && moduleResponse.data) {
                suggestions = ['Plan crop activities', 'Check soil conditions', 'Get market updates'];
            } else if (intent === 'mandi_prices' && moduleResponse.data) {
                suggestions = ['Compare with other crops', 'Get weather forecast', 'Find best markets'];
            }

            return {
                text: responseText,
                suggestions: suggestions
            };

        } catch (error) {
            console.error('Response generation error:', error);
            return {
                text: "I can help you with agricultural questions. What would you like to know?",
                suggestions: ['Crop calendar', 'Weather forecast', 'Market prices', 'Soil analysis']
            };
        }
    }

    /**
     * Clear conversation history for a user
     */
    clearConversation(userId) {
        this.conversationMemory.delete(userId);
        return { success: true, message: 'Conversation cleared' };
    }

    /**
     * Get conversation history for a user
     */
    getConversationHistory(userId) {
        const conversation = this.conversationMemory.get(userId);
        return conversation ? conversation.history : [];
    }

    /**
     * Get user's preferred language
     */
    getUserLanguage(userId) {
        return this.userLanguagePreferences.get(userId) || this.defaultLanguage;
    }

    /**
     * Set user's preferred language
     */
    setUserLanguage(userId, language) {
        if (translationService.isLanguageSupported(language) || language === 'en') {
            this.userLanguagePreferences.set(userId, language);
            return true;
        }
        return false;
    }

    /**
     * Detect language change commands
     */
    detectLanguageChange(message) {
        const langPatterns = {
            'hi': ['hindi', 'हिंदी', 'hindi me', 'हिंदी में'],
            'mr': ['marathi', 'मराठी', 'marathi me', 'मराठीत'],
            'te': ['telugu', 'తెలుగు', 'telugu lo', 'తెలుగులో'],
            'bn': ['bengali', 'bangla', 'বাংলা', 'bengali te'],
            'ta': ['tamil', 'தமிழ்', 'tamil il', 'தமிழில்'],
            'gu': ['gujarati', 'ગુજરાતી', 'gujarati ma', 'ગુજરાતીમાં'],
            'kn': ['kannada', 'ಕನ್ನಡ', 'kannada alli', 'ಕನ್ನಡದಲ್ಲಿ'],
            'ml': ['malayalam', 'മലയാളം', 'malayalam il', 'മലയാളത്തിൽ'],
            'pa': ['punjabi', 'ਪੰਜਾਬੀ', 'punjabi vich', 'ਪੰਜਾਬੀ ਵਿੱਚ'],
            'ur': ['urdu', 'اردو', 'urdu mein', 'اردو میں'],
            'en': ['english', 'अंग्रेजी', 'english me', 'انگریزی']
        };

        const msgLower = message.toLowerCase();
        
        // Check for explicit language change commands
        if (msgLower.includes('change language') || msgLower.includes('switch to') || 
            msgLower.includes('भाषा बदलें') || msgLower.includes('भाषा') ||
            msgLower.includes('language')) {
            
            for (const [langCode, patterns] of Object.entries(langPatterns)) {
                if (patterns.some(pattern => msgLower.includes(pattern.toLowerCase()))) {
                    return { language: langCode };
                }
            }
        }

        return null;
    }

    /**
     * Get translated suggestions for better UX
     */
    async getTranslatedSuggestions(suggestions, language) {
        if (language === 'en') return suggestions;
        
        try {
            return await translationService.translateBatch(suggestions, language);
        } catch (error) {
            console.error('Suggestion translation error:', error);
            return suggestions;
        }
    }

    /**
     * Get available languages for the frontend
     */
    getAvailableLanguages() {
        return {
            'en': 'English',
            ...translationService.getSupportedLanguages()
        };
    }
}

module.exports = new ChatbotService();
