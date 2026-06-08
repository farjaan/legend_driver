import React, { useState } from 'react';
import { SplashScreen } from '@features/splash/SplashScreen';
import { useAuthStore } from '@store/authStore';
import { RootNavigator } from './RootNavigator';

export function AppShell() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onReady={authenticated => {
          if (authenticated) {
            useAuthStore.setState({ isAuthenticated: true });
          }
          setShowSplash(false);
        }}
      />
    );
  }

  return <RootNavigator />;
}
