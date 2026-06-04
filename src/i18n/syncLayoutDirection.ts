import { I18nManager } from 'react-native';
import type { AppLanguage } from '@store/languageStore';

/** Clears native RTL left over from a previous session or hot reload. */
export function resetStuckNativeRtl() {
  I18nManager.allowRTL(true);
  if (I18nManager.isRTL) {
    I18nManager.forceRTL(false);
  }
}

export function isRtlLanguage(language: AppLanguage): boolean {
  return language === 'ar';
}

export function syncLayoutDirection(language: AppLanguage) {
  const rtl = isRtlLanguage(language);
  I18nManager.allowRTL(true);
  if (I18nManager.isRTL !== rtl) {
    I18nManager.forceRTL(rtl);
  }
  return rtl;
}
