import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from './translations.js';

const PreferencesContext = createContext(null);

const LANGUAGE_KEY = 'neir.language';
const TEXT_SIZE_KEY = 'neir.textSize';
const THEME_KEY = 'neir.theme';

const getStoredValue = (key, fallback) => {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const PreferencesProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => getStoredValue(LANGUAGE_KEY, 'en'));
  const [textSize, setTextSizeState] = useState(() => getStoredValue(TEXT_SIZE_KEY, 'standard'));
  const [theme, setThemeState] = useState(() => getStoredValue(THEME_KEY, 'light'));

  useEffect(() => {
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
    document.documentElement.dataset.language = language;
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
    } catch {}
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.textSize = textSize;
    try {
      window.localStorage.setItem(TEXT_SIZE_KEY, textSize);
    } catch {}
  }, [textSize]);

  useEffect(() => {
    const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    try {
      window.localStorage.setItem(THEME_KEY, resolvedTheme);
    } catch {}
  }, [theme]);

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(nextLanguage === 'bn' ? 'bn' : 'en');
  }, []);

  const setTextSize = useCallback((nextSize) => {
    setTextSizeState(['compact', 'standard', 'large'].includes(nextSize) ? nextSize : 'standard');
  }, []);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme === 'dark' ? 'dark' : 'light');
  }, []);

  const t = useCallback((value, variables) => translate(language, value, variables), [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    textSize,
    setTextSize,
    theme,
    setTheme,
    t,
    locale: language === 'bn' ? 'bn-BD' : 'en-BD',
  }), [language, setLanguage, textSize, setTextSize, theme, setTheme, t]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }
  return context;
};
