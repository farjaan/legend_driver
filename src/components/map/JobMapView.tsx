import React, { useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { DEFAULT_MAP_REGION } from '@config/env';
import { Layout } from '@constants/layout';
import { useAppTheme } from '@theme/useAppTheme';

type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  variant: 'customer' | 'branch';
};

type Props = {
  pins: MapPin[];
  height?: number;
};

export function JobMapView({ pins, height = 280 }: Props) {
  const { theme } = useAppTheme();
  const mapRef = useRef<MapView>(null);

  const region = useMemo((): Region => {
    if (pins.length === 0) {
      return { ...DEFAULT_MAP_REGION };
    }
    if (pins.length === 1) {
      const p = pins[0];
      return {
        latitude: p.latitude,
        longitude: p.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      };
    }
    const lats = pins.map(p => p.latitude);
    const lngs = pins.map(p => p.longitude);
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
  }, [pins]);

  const onMapReady = () => {
    if (pins.length < 2 || !mapRef.current) return;
    mapRef.current.fitToCoordinates(
      pins.map(p => ({ latitude: p.latitude, longitude: p.longitude })),
      {
        edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
        animated: true,
      },
    );
  };

  return (
    <View style={[styles.wrap, { height, borderColor: theme.cardBorder }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        onMapReady={onMapReady}
        showsUserLocation
        showsMyLocationButton={Platform.OS === 'android'}
        toolbarEnabled={false}>
        {pins.map(pin => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={pin.title}
            description={pin.description}
            pinColor={pin.variant === 'customer' ? '#F08900' : '#2C1B47'}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Layout.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
