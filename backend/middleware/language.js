const { Language } = require('../models');

// Translation mappings for common UI elements
const translations = {
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    cropCalendar: 'Crop Calendar',
    weather: 'Weather',
    soilAnalysis: 'Soil Analysis',
    emergencies: 'Emergencies',
    mandiPrices: 'Mandi Prices',
    schemes: 'Government Schemes',
    practices: 'Sustainable Practices',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information'
  },
  hi: {
    welcome: 'स्वागत है',
    dashboard: 'डैशबोर्ड',
    cropCalendar: 'फसल कैलेंडर',
    weather: 'मौसम',
    soilAnalysis: 'मिट्टी विश्लेषण',
    emergencies: 'आपातकाल',
    mandiPrices: 'मंडी भाव',
    schemes: 'सरकारी योजनाएं',
    practices: 'टिकाऊ प्रथाएं',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    submit: 'सबमिट करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    loading: 'लोड हो रहा है...',
    success: 'सफलता',
    error: 'त्रुटि',
    warning: 'चेतावनी',
    info: 'जानकारी'
  },
  te: {
    welcome: 'స్వాగతం',
    dashboard: 'డాష్‌బోర్డ్',
    cropCalendar: 'పంట క్యాలెండర్',
    weather: 'వాతావరణం',
    soilAnalysis: 'మట్టి విశ్లేషణ',
    emergencies: 'అత్యవసర పరిస్థితులు',
    mandiPrices: 'మార్కెట్ ధరలు',
    schemes: 'ప్రభుత్వ పథకాలు',
    practices: 'స్థిర వ్యవసాయ పద్ధతులు',
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగ్‌లు',
    logout: 'లాగ్ అవుట్',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    submit: 'సబ్మిట్ చేయండి',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    add: 'జోడించండి',
    search: 'వెతకండి',
    filter: 'ఫిల్టర్',
    loading: 'లోడ్ అవుతోంది...',
    success: 'విజయం',
    error: 'లోపం',
    warning: 'హెచ్చరిక',
    info: 'సమాచారం'
  },
  ta: {
    welcome: 'வணக்கம்',
    dashboard: 'டாஷ்போர்ட்',
    cropCalendar: 'பயிர் நாட்காட்டி',
    weather: 'வானிலை',
    soilAnalysis: 'மண் பகுப்பாய்வு',
    emergencies: 'அவசரநிலைகள்',
    mandiPrices: 'சந்தை விலைகள்',
    schemes: 'அரசு திட்டங்கள்',
    practices: 'நிலையான வேளாண் முறைகள்',
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    submit: 'சமர்ப்பி',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    add: 'சேர்',
    search: 'தேடு',
    filter: 'வடிகட்டி',
    loading: 'ஏற்றுகிறது...',
    success: 'வெற்றி',
    error: 'பிழை',
    warning: 'எச்சரிக்கை',
    info: 'தகவல்'
  },
  kn: {
    welcome: 'ಸ್ವಾಗತ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    cropCalendar: 'ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್',
    weather: 'ಹವಾಮಾನ',
    soilAnalysis: 'ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ',
    emergencies: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳು',
    mandiPrices: 'ಮಾರುಕಟ್ಟೆ ದರಗಳು',
    schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    practices: 'ಸಮರ್ಥನೀಯ ಕೃಷಿ ಪದ್ಧತಿಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    logout: 'ಲಾಗ್ ಔಟ್',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    submit: 'ಸಲ್ಲಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    add: 'ಸೇರಿಸಿ',
    search: 'ಹುಡುಕಿ',
    filter: 'ಫಿಲ್ಟರ್',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    success: 'ಯಶಸ್ಸು',
    error: 'ದೋಷ',
    warning: 'ಎಚ್ಚರಿಕೆ',
    info: 'ಮಾಹಿತಿ'
  },
  mr: {
    welcome: 'स्वागत',
    dashboard: 'डॅशबोर्ड',
    cropCalendar: 'पीक कॅलेंडर',
    weather: 'हवामान',
    soilAnalysis: 'माती विश्लेषण',
    emergencies: 'आपत्कालीन परिस्थिती',
    mandiPrices: 'मंडई भाव',
    schemes: 'सरकारी योजना',
    practices: 'शाश्वत शेती पद्धती',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्ज',
    logout: 'लॉग आउट',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    submit: 'सबमिट करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    add: 'जोडा',
    search: 'शोधा',
    filter: 'फिल्टर',
    loading: 'लोड होत आहे...',
    success: 'यश',
    error: 'त्रुटी',
    warning: 'इशारा',
    info: 'माहिती'
  }
};

// Middleware to add language context and translations
const languageMiddleware = (req, res, next) => {
  // Get language from user session or default to English
  const userLanguage = req.language?.code || 'en';
  
  // Add language data to request
  req.userLanguage = userLanguage;
  req.translations = translations[userLanguage] || translations.en;
  
  // Override res.json to automatically include language context
  const originalJson = res.json;
  res.json = function(data) {
    // If this is a successful response, add language context
    if (data && typeof data === 'object' && data.success !== false) {
      data.language = {
        code: userLanguage,
        translations: req.translations
      };
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Helper function to get translated text
const translate = (key, languageCode = 'en') => {
  return translations[languageCode]?.[key] || translations.en[key] || key;
};

// Helper function to get multiple translations
const getTranslations = (keys, languageCode = 'en') => {
  const result = {};
  keys.forEach(key => {
    result[key] = translate(key, languageCode);
  });
  return result;
};

// Helper function to format response with language context
const formatResponse = (success, message, data = null, language = 'en') => {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
    language: {
      code: language,
      translations: translations[language] || translations.en
    }
  };
};

module.exports = {
  languageMiddleware,
  translate,
  getTranslations,
  formatResponse,
  translations
};
