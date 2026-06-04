import { useCallback } from 'react';
import { DevSettings } from 'react-native';
import { useTranslation } from 'react-i18next';
import { syncLayoutDirection, isRtlLanguage } from '@i18n/syncLayoutDirection';
import { useLanguageStore, type AppLanguage } from '@store/languageStore';

export function useLanguage() {
  const { t, i18n } = useTranslation();
  const language = useLanguageStore(s => s.language);
  const setLanguageStore = useLanguageStore(s => s.setLanguage);
  const isRTL = isRtlLanguage(language);

  const setLanguage = useCallback(
    (lang: AppLanguage) => {
      const wasRtl = isRtlLanguage(language);
      const willRtl = isRtlLanguage(lang);
      setLanguageStore(lang);
      void i18n.changeLanguage(lang);
      syncLayoutDirection(lang);
      if (wasRtl !== willRtl) {
        DevSettings.reload();
      }
    },
    [i18n, language, setLanguageStore],
  );

  return { t, language, setLanguage, isRTL, i18n };
}

export type { AppLanguage };
