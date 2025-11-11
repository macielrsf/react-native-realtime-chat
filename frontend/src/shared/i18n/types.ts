// frontend/src/shared/i18n/types.ts
export type Language = 'pt-BR' | 'en';

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

export interface Translations {
  [language: string]: TranslationKey;
}

export interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (language: Language) => void;
  t: (key: string, module?: string) => string;
}
