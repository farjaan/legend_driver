import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@store/authStore';
import { isRtlLanguage } from '@i18n/syncLayoutDirection';
import { useLanguageStore } from '@store/languageStore';
import { useAppTheme } from '@theme/useAppTheme';
import { getNavigationTheme } from '@theme/navigationTheme';
import { AuthNavigator } from './AuthNavigator';
import { MainBootstrap } from './MainBootstrap';
import { JobDetailScreen } from '@features/jobs/JobDetailScreen';
import { JobMapScreen } from '@features/map/JobMapScreen';
import { HandoverVerifyScreen } from '@features/verify/HandoverVerifyScreen';
import { CheckoutWizardScreen } from '@features/handover/CheckoutWizardScreen';
import { CheckinWizardScreen } from '@features/handover/CheckinWizardScreen';
import { ChauffeurTripScreen } from '@features/chauffeur/ChauffeurTripScreen';
import { TripSummaryScreen } from '@features/chauffeur/TripSummaryScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { theme } = useAppTheme();
  const language = useLanguageStore(s => s.language);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const navTheme = useMemo(() => getNavigationTheme(theme), [theme]);
  const direction = isRtlLanguage(language) ? 'rtl' : 'ltr';

  return (
    <NavigationContainer theme={navTheme} direction={direction}>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainBootstrap}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="JobDetail"
              component={JobDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="JobMap"
              component={JobMapScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HandoverVerify"
              component={HandoverVerifyScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CheckoutWizard"
              component={CheckoutWizardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CheckinWizard"
              component={CheckinWizardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChauffeurTrip"
              component={ChauffeurTripScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TripSummary"
              component={TripSummaryScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
