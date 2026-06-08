import React, { useMemo, useRef } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { DEFAULT_MAP_REGION } from '@config/env';
import { Layout } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

export type MapPinVariant = 'customer' | 'branch' | 'pickup' | 'drop';

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  variant: MapPinVariant;
};

type Coord = { latitude: number; longitude: number };

type Props = {
  pins: MapPin[];
  routeCoordinates?: Coord[];
  height?: number;
  fullScreen?: boolean;
  showUserLocation?: boolean;
  style?: ViewStyle;
};

const PIN_COLORS: Record<MapPinVariant, string> = {
  customer: '#F08900',
  branch: '#2C1B47',
  pickup: '#16A34A',
  drop: '#DC2626',
};

export function JobMapView({
  pins,
  routeCoordinates,
  height,
  fullScreen = false,
  showUserLocation = false,
  style,
}: Props) {
  const { theme } = useAppTheme();
  const mapRef = useRef<MapView>(null);

  const region = useMemo((): Region => {
    const all = [...pins, ...(routeCoordinates ?? [])];
    if (all.length === 0) {
      return { ...DEFAULT_MAP_REGION };
    }
    if (all.length === 1) {
      const p = all[0];
      return {
        latitude: p.latitude,
        longitude: p.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      };
    }
    const lats = all.map(p => p.latitude);
    const lngs = all.map(p => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latDelta = Math.max((maxLat - minLat) * 1.6, 0.05);
    const lngDelta = Math.max((maxLng - minLng) * 1.6, 0.05);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [pins, routeCoordinates]);

  const onMapReady = () => {
    const coords = routeCoordinates?.length
      ? routeCoordinates
      : pins.map(p => ({ latitude: p.latitude, longitude: p.longitude }));
    if (coords.length < 2 || !mapRef.current) return;
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 48, bottom: 200, left: 48 },
      animated: true,
    });
  };

  return (
    <View
      style={[
        styles.wrap,
        fullScreen ? styles.wrapFullScreen : styles.wrapCard,
        height ? { height } : styles.wrapFlex,
        !fullScreen && { borderColor: theme.cardBorder },
        style,
      ]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        onMapReady={onMapReady}
        loadingEnabled
        mapType="standard"
        showsUserLocation={showUserLocation}
        showsMyLocationButton={showUserLocation && Platform.OS === 'android'}
        toolbarEnabled={false}>
        {routeCoordinates && routeCoordinates.length > 1 ? (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#F08900"
            strokeWidth={4}
            lineDashPattern={Platform.OS === 'ios' ? undefined : [0]}
          />
        ) : null}
        {pins.map(pin => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={pin.title}
            description={pin.description}
            pinColor={PIN_COLORS[pin.variant]}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 200,
  },
  wrapCard: {
    borderRadius: Layout.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
  },
  wrapFullScreen: {
    flex: 1,
    overflow: 'hidden',
  },
  wrapFlex: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
