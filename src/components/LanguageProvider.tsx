import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isRtlLanguage, syncLayoutDirection } from '@i18n/syncLayoutDirection';
import { useLanguageStore } from '@store/languageStore';

type Props = {
  children: React.ReactNode;
};

export function LanguageProvider({ children }: Props) {
  const language = useLanguageStore(s => s.language);
  const { i18n } = useTranslation();
  const isRTL = isRtlLanguage(language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
    syncLayoutDirection(language);
  }, [language, i18n]);

  return <View style={[styles.root, isRTL ? styles.rtl : styles.ltr]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  ltr: {
    direction: 'ltr',
    writingDirection: 'ltr',
  },
  rtl: {
    direction: 'rtl',
    writingDirection: 'rtl',
  },
});
