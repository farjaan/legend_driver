import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  type ImageSourcePropType,
  type ImageStyle,
  StyleSheet,
  View,
  type StyleProp,
} from 'react-native';
import { PlaceholderImages } from '@assets/placeholders';
import { BrandColors } from '@constants/colors';

type Props = {
  uri?: string;
  localSource?: ImageSourcePropType;
  fallbackSource?: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch';
};

export function NetworkImage({
  uri,
  localSource,
  fallbackSource = PlaceholderImages.carFront,
  style,
  resizeMode = 'cover',
}: Props) {
  const [remoteFailed, setRemoteFailed] = useState(false);
  const [loading, setLoading] = useState(Boolean(uri));

  const useRemote = Boolean(uri) && !remoteFailed;

  const source = useMemo<ImageSourcePropType>(() => {
    if (useRemote) return { uri: uri! };
    return localSource ?? fallbackSource;
  }, [useRemote, uri, localSource, fallbackSource]);

  return (
    <View style={[styles.wrap, style]}>
      {loading && useRemote ? (
        <View style={styles.loader}>
          <ActivityIndicator color={BrandColors.accentOrange} />
        </View>
      ) : null}
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode={resizeMode}
        onLoadStart={() => {
          if (useRemote) setLoading(true);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setRemoteFailed(true);
          setLoading(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#E8E4EE',
  },
  loader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
