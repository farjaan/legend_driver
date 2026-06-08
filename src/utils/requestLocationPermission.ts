import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

/** Runtime location permission (Android 6+). Not required to render map tiles. */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const fine = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission',
      message: 'Allow location to show your position on the job map.',
      buttonPositive: 'Allow',
      buttonNegative: 'Not now',
    },
  );

  if (fine === PermissionsAndroid.RESULTS.GRANTED) return true;

  const coarse = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  );
  return coarse;
}

export function showLocationPermissionDeniedAlert(
  t: (key: string) => string,
  onOpenSettings?: () => void,
) {
  Alert.alert(
    t('map.permissionTitle'),
    t('map.permissionBody'),
    [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('map.openSettings'),
        onPress: () => {
          if (onOpenSettings) onOpenSettings();
          else void Linking.openSettings();
        },
      },
    ],
  );
}
