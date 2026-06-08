import React, { useEffect, useState } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppIcon } from '@components/icons';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { jobService } from '@api/services/jobService';
import { useJobStore } from '@store/jobStore';
import { useAuthStore } from '@store/authStore';
import { useSplashAnimation } from './useSplashAnimation';

const MIN_SPLASH_MS = 2600;
const APP_VERSION = '0.0.1';

type Props = {
  onReady: (isAuthenticated: boolean) => void;
};

export function SplashScreen({ onReady }: Props) {
  const { width } = useWindowDimensions();
  const fetchJobs = useJobStore(s => s.fetchJobs);
  const restoreSession = useAuthStore(s => s.restoreSession);
  const [statusText, setStatusText] = useState('Loading…');
  const {
    logoOpacity,
    logoScale,
    logoY,
    ringScale,
    ringOpacity,
    barWidth,
  } = useSplashAnimation();

  const progressWidth = barWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.55],
  });

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const started = Date.now();
      let isAuthenticated = false;

      try {
        setStatusText('Checking session…');
        isAuthenticated = await restoreSession();

        if (isAuthenticated) {
          setStatusText('Syncing jobs & bookings…');
          const jobs = await jobService.fetchJobList();
          if (!cancelled) {
            useJobStore.setState({ jobs, isLoading: false, error: null });
          }
        }
      } catch {
        if (!cancelled) {
          setStatusText('Offline — showing cached routes');
          await fetchJobs();
        }
      }

      const elapsed = Date.now() - started;
      if (elapsed < MIN_SPLASH_MS) {
        await new Promise<void>(resolve => {
          setTimeout(resolve, MIN_SPLASH_MS - elapsed);
        });
      }

      if (!cancelled) onReady(isAuthenticated);
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [fetchJobs, onReady, restoreSession]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.brandDeep} />
      <LinearGradient
        colors={[BrandColors.brandDeep, BrandColors.brandBurgundyDeep, BrandColors.brandSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.grid} pointerEvents="none">
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[styles.gridLine, { left: `${20 + i * 22}%` }]} />
        ))}
      </View>

      <Animated.View
        style={[
          styles.ring,
          { opacity: ringOpacity, transform: [{ scale: ringScale }] },
        ]}
      />

      <Animated.View
        style={[
          styles.logoBlock,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }, { translateY: logoY }],
          },
        ]}>
        <View style={styles.iconBadge}>
          <AppIcon name="car" size={42} color={BrandColors.accentOrange} solid />
        </View>
        <Text style={styles.brand}>LEGEND</Text>
        <Text style={styles.brandSub}>DRIVER</Text>
        <Text style={styles.version}>v{APP_VERSION}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.status}>{statusText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.brandDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { ...StyleSheet.absoluteFill },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  ring: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: 'rgba(240, 137, 0, 0.35)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  logoBlock: { alignItems: 'center', zIndex: 2 },
  iconBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  brand: {
    fontFamily: APP_FONTS.bold,
    fontSize: 42,
    letterSpacing: 6,
    color: BrandColors.brandWhite,
  },
  brandSub: {
    fontFamily: APP_FONTS.bold,
    fontSize: 22,
    letterSpacing: 12,
    color: BrandColors.accentOrange,
    marginTop: 4,
  },
  version: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 12,
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 56,
    alignItems: 'center',
    width: '100%',
  },
  progressTrack: {
    width: '55%',
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BrandColors.accentOrange,
    borderRadius: 2,
  },
  status: {
    fontFamily: APP_FONTS.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 12,
  },
});
