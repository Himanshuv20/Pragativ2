import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import enTranslations from '../translations/en.json';
import hiTranslations from '../translations/hi.json';
import mrTranslations from '../translations/mr.json';
import teTranslations from '../translations/te.json';
import paTranslations from '../translations/pa.json';
import guTranslations from '../translations/gu.json';
import taTranslations from '../translations/ta.json';
import knTranslations from '../translations/kn.json';
import bnTranslations from '../translations/bn.json';
import mlTranslations from '../translations/ml.json';
import asTranslations from '../translations/as.json';
import urTranslations from '../translations/ur.json';

// Import all available translations
const translations: Record<string, any> = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations,
  te: teTranslations,
  pa: paTranslations,
  gu: guTranslations,
  ta: taTranslations,
  kn: knTranslations,
  bn: bnTranslations,
  ml: mlTranslations,
  as: asTranslations,
  ur: urTranslations,
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

interface LanguageContextType {
  currentLanguage: string;
  availableLanguages: Record<string, string>;
  translations: Record<string, any>;
  changeLanguage: (language: string) => Promise<void>;
  t: (key: string, defaultText?: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [availableLanguages, setAvailableLanguages] = useState<Record<string, string>>({
    'en': 'English',
    'hi': 'हिंदी (Hindi)',
    'mr': 'मराठी (Marathi)',
    'te': 'తెలుగు (Telugu)',
    'pa': 'ਪੰਜਾਬੀ (Punjabi)',
    'gu': 'ગુજરાતી (Gujarati)',
    'ta': 'தமிழ் (Tamil)',
    'kn': 'ಕನ್ನಡ (Kannada)',
    'bn': 'বাংলা (Bengali)',
    'ml': 'മലയാളം (Malayalam)',
    'as': 'অসমীয়া (Assamese)',
    'ur': 'اردو (Urdu)'
  });
  const [currentTranslations, setCurrentTranslations] = useState<Record<string, any>>(enTranslations);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      setLoading(true);
      
      // Try to load user's preferred language from localStorage
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage && savedLanguage !== 'en') {
        await changeLanguage(savedLanguage);
      } else {
        setCurrentTranslations(enTranslations);
      }
    } catch (error) {
      console.error('Error initializing language:', error);
      setCurrentTranslations(enTranslations);
    } finally {
      setLoading(false);
    }
  };

  const loadTranslations = async (languageCode: string) => {
    try {
      let translations: Record<string, any>;
      
      switch (languageCode) {
        case 'hi':
          translations = hiTranslations;
          break;
        case 'mr':
          translations = mrTranslations;
          break;
        case 'te':
          translations = teTranslations;
          break;
        case 'en':
        default:
          translations = enTranslations;
          break;
      }
      
      setCurrentTranslations(translations);
      console.log('Translations loaded for:', languageCode, translations);
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to English
      setCurrentTranslations(enTranslations);
    }
  };

  const changeLanguage = async (languageCode: string) => {
    if (languageCode === currentLanguage) return;

    try {
      setLoading(true);
      setCurrentLanguage(languageCode);
      
      // Save to localStorage
      localStorage.setItem('preferredLanguage', languageCode);
      
      // Load translations for the new language
      await loadTranslations(languageCode);
      
      console.log('Language changed to:', languageCode);
      
      // If user is authenticated, save preference to backend
      const userId = localStorage.getItem('userId') || 'guest';
      if (userId !== 'guest') {
        try {
          await axios.post(`${API_BASE_URL}/api/translation/user-language`, {
            userId,
            language: languageCode
          });
        } catch (error) {
          console.error('Error saving language preference to backend:', error);
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const keys = key.split('.');
    let result: any = currentTranslations;
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        console.log('Translation key not found:', key, 'in', currentLanguage);
        return defaultText || key;
      }
    }
    
    return typeof result === 'string' ? result : defaultText || key;
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    availableLanguages,
    translations: currentTranslations,
    changeLanguage,
    t,
    loading
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
