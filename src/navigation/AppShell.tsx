import React, { useState } from 'react';
import { SplashScreen } from '@features/splash/SplashScreen';
import { RootNavigator } from './RootNavigator';

export function AppShell() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onReady={() => setShowSplash(false)} />;
  }

  return <RootNavigator />;
}
