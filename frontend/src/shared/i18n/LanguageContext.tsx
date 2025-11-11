// frontend/src/shared/i18n/LanguageContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, LanguageContextType } from './types';
import { getNestedProperty, mergeTranslations } from './utils';

// Import all translation modules
import authPtBr from '../../auth/presentation/i18n/pt-BR.json';
import authEn from '../../auth/presentation/i18n/en.json';
import chatPtBr from '../../chat/presentation/i18n/pt-BR.json';
import chatEn from '../../chat/presentation/i18n/en.json';
import usersPtBr from '../../users/presentation/i18n/pt-BR.json';
import usersEn from '../../users/presentation/i18n/en.json';
import corePtBr from '../../core/presentation/i18n/pt-BR.json';
import coreEn from '../../core/presentation/i18n/en.json';

const LANGUAGE_STORAGE_KEY = '@language';
const DEFAULT_LANGUAGE: Language = 'pt-BR';

// Merge all translations by language
const translations = {
  'pt-BR': mergeTranslations(authPtBr, chatPtBr, usersPtBr, corePtBr),
  en: mergeTranslations(authEn, chatEn, usersEn, coreEn),
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] =
    useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    loadStoredLanguage();
  }, []);

  const loadStoredLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && (stored === 'pt-BR' || stored === 'en')) {
        setCurrentLanguage(stored as Language);
      }
    } catch (error) {
      console.warn('Failed to load stored language:', error);
    }
  };

  const changeLanguage = async (language: Language) => {
    try {
      setCurrentLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.warn('Failed to store language:', error);
    }
  };

  const t = (key: string, module?: string): string => {
    const currentTranslations = translations[currentLanguage];

    if (module) {
      // Look for key in specific module first
      const moduleKey = `${module}.${key}`;
      const moduleTranslation = getNestedProperty(
        currentTranslations,
        moduleKey,
      );
      if (moduleTranslation !== moduleKey) {
        return moduleTranslation;
      }
    }

    // Look for key in global scope
    return getNestedProperty(currentTranslations, key, key);
  };

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
