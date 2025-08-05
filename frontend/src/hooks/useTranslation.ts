import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

interface TranslationCache {
  [key: string]: string;
}

interface UseTranslationReturn {
  translate: (text: string, targetLanguage?: string) => Promise<string>;
  translateBatch: (texts: string[], targetLanguage?: string) => Promise<string[]>;
  translateAgricultural: (terms: string[], targetLanguage?: string) => Promise<string[]>;
  isLoading: boolean;
  error: string | null;
  currentLanguage: string;
  setLanguage: (language: string) => void;
  availableLanguages: Record<string, string>;
}

export const useTranslation = (userId: string): UseTranslationReturn => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [availableLanguages, setAvailableLanguages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<TranslationCache>({});

  useEffect(() => {
    fetchAvailableLanguages();
    fetchUserLanguage();
  }, [userId]);

  const fetchAvailableLanguages = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/translation/languages`);
      if (response.data.success) {
        setAvailableLanguages(response.data.languages);
      }
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  }, []);

  const fetchUserLanguage = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/translation/user-language/${userId}`);
      if (response.data.success) {
        setCurrentLanguage(response.data.language);
      }
    } catch (err) {
      console.error('Error fetching user language:', err);
    }
  }, [userId]);

  const setLanguage = useCallback(async (language: string) => {
    if (!userId || language === currentLanguage) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/translation/user-language`, {
        userId,
        language
      });

      if (response.data.success) {
        setCurrentLanguage(language);
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update language');
    }
  }, [userId, currentLanguage]);

  const translate = useCallback(async (
    text: string, 
    targetLanguage?: string
  ): Promise<string> => {
    const lang = targetLanguage || currentLanguage;
    
    // Return original text if target is English
    if (lang === 'en') {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${lang}`;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/api/translation/translate`, {
        text,
        targetLanguage: lang
      });

      if (response.data.success) {
        const translation = response.data.translatedText;
        
        // Cache the result
        setCache(prev => ({ ...prev, [cacheKey]: translation }));
        
        return translation;
      } else {
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err.response?.data?.error || 'Translation failed');
      return text; // Return original text on error
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, cache]);

  const translateBatch = useCallback(async (
    texts: string[], 
    targetLanguage?: string
  ): Promise<string[]> => {
    const lang = targetLanguage || currentLanguage;
    
    // Return original texts if target is English
    if (lang === 'en') {
      return texts;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/api/translation/translate`, {
        text: texts,
        targetLanguage: lang,
        batch: true
      });

      if (response.data.success) {
        const translations = response.data.translatedText;
        
        // Cache the results
        const newCacheEntries: TranslationCache = {};
        texts.forEach((text, index) => {
          newCacheEntries[`${text}_${lang}`] = translations[index];
        });
        setCache(prev => ({ ...prev, ...newCacheEntries }));
        
        return translations;
      } else {
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      console.error('Batch translation error:', err);
      setError(err.response?.data?.error || 'Batch translation failed');
      return texts; // Return original texts on error
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  const translateAgricultural = useCallback(async (
    terms: string[], 
    targetLanguage?: string
  ): Promise<string[]> => {
    const lang = targetLanguage || currentLanguage;
    
    // Return original terms if target is English
    if (lang === 'en') {
      return terms;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/api/translation/translate-agricultural`, {
        terms,
        targetLanguage: lang
      });

      if (response.data.success) {
        const translations = response.data.translatedTerms;
        
        // Cache the results
        const newCacheEntries: TranslationCache = {};
        terms.forEach((term, index) => {
          newCacheEntries[`${term}_${lang}_agri`] = translations[index];
        });
        setCache(prev => ({ ...prev, ...newCacheEntries }));
        
        return translations;
      } else {
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      console.error('Agricultural translation error:', err);
      setError(err.response?.data?.error || 'Agricultural translation failed');
      return terms; // Return original terms on error
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  return {
    translate,
    translateBatch,
    translateAgricultural,
    isLoading,
    error,
    currentLanguage,
    setLanguage,
    availableLanguages
  };
};

export default useTranslation;
