import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resetStuckNativeRtl } from './syncLayoutDirection';
import en from './locales/en.json';
import ar from './locales/ar.json';

resetStuckNativeRtl();

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
