import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

export type MediaPermissionKind = 'camera' | 'gallery' | 'both';

/**
 * Requests runtime permissions needed for KYC photo capture / gallery pick on Android.
 * iOS prompts are driven by Info.plist usage strings when picker opens.
 */
export async function requestMediaPermissions(
  kind: MediaPermissionKind,
): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const apiLevel = typeof Platform.Version === 'number' ? Platform.Version : 0;

  if (kind === 'gallery' || kind === 'both') {
    if (apiLevel >= 33) {
      const images = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      if (images !== PermissionsAndroid.RESULTS.GRANTED) return false;
    } else {
      const storage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (storage !== PermissionsAndroid.RESULTS.GRANTED) return false;
    }
  }

  if (kind === 'camera' || kind === 'both') {
    const camera = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (camera !== PermissionsAndroid.RESULTS.GRANTED) return false;
  }

  return true;
}

export function showMediaPermissionDeniedAlert(
  t: (key: string) => string,
  onOpenSettings?: () => void,
) {
  Alert.alert(
    t('kyc.permissionDeniedTitle'),
    t('kyc.permissionDeniedBody'),
    [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('kyc.openSettings'),
        onPress: () => {
          if (onOpenSettings) onOpenSettings();
          else void Linking.openSettings();
        },
      },
    ],
  );
}
