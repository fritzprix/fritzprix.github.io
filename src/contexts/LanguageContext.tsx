import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TranslationKey, translations } from '../locales/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'site-lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'ko' || saved === 'en') {
        return saved;
      }
      return navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
    }
    return 'ko';
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'ko' ? 'en' : 'ko');
  }, [lang, setLang]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = useCallback((key: TranslationKey): string => {
    return translations[lang][key] || translations['ko'][key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
