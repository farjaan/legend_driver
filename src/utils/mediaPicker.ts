import { Alert, NativeModules, Platform } from 'react-native';
import {
  requestMediaPermissions,
  showMediaPermissionDeniedAlert,
  type MediaPermissionKind,
} from './requestMediaPermissions';
import type {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

type LegacyImagePicker = {
  launchCamera: (options: CameraOptions, callback: (result: ImagePickerResponse) => void) => void;
  launchImageLibrary: (
    options: ImageLibraryOptions,
    callback: (result: ImagePickerResponse) => void,
  ) => void;
};

/** Android native Options.java requires these fields (e.g. restrictMimeTypes array). */
const DEFAULT_IMAGE_PICKER_OPTIONS: ImageLibraryOptions & CameraOptions = {
  mediaType: 'photo',
  restrictMimeTypes: [],
  videoQuality: 'high',
  quality: 1,
  maxWidth: 0,
  maxHeight: 0,
  includeBase64: false,
  cameraType: 'back',
  selectionLimit: 1,
  saveToPhotos: false,
  durationLimit: 0,
  includeExtra: false,
  presentationStyle: 'pageSheet',
  assetRepresentationMode: 'auto',
};

function withDefaults<T extends ImageLibraryOptions | CameraOptions>(options: T) {
  return { ...DEFAULT_IMAGE_PICKER_OPTIONS, ...options };
}

function isTurboModuleProxyEnabled(): boolean {
  return Boolean((globalThis as { __turboModuleProxy?: unknown }).__turboModuleProxy);
}

function getTurboImagePicker(): LegacyImagePicker | null {
  try {
    if (!isTurboModuleProxyEnabled()) return null;
    const { TurboModuleRegistry } = require('react-native') as typeof import('react-native');
    const mod = TurboModuleRegistry.get('ImagePicker') as LegacyImagePicker | null;
    if (
      mod != null &&
      typeof (mod as LegacyImagePicker).launchImageLibrary === 'function' &&
      typeof (mod as LegacyImagePicker).launchCamera === 'function'
    ) {
      return mod;
    }
    return null;
  } catch {
    return null;
  }
}

function getLegacyImagePicker(): LegacyImagePicker | null {
  const mod = NativeModules.ImagePicker as LegacyImagePicker | undefined;
  if (typeof mod?.launchImageLibrary === 'function' && typeof mod?.launchCamera === 'function') {
    return mod;
  }
  return null;
}

/** True when a native ImagePicker implementation is linked in the current binary. */
export function isImagePickerAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Boolean(getTurboImagePicker() ?? getLegacyImagePicker());
}

function runLegacy(
  picker: LegacyImagePicker,
  method: 'launchCamera' | 'launchImageLibrary',
  options: CameraOptions | ImageLibraryOptions,
): Promise<ImagePickerResponse> {
  return new Promise(resolve => {
    picker[method](options, resolve);
  });
}

async function ensureMediaPermission(
  kind: MediaPermissionKind,
  t?: (key: string) => string,
): Promise<boolean> {
  const ok = await requestMediaPermissions(kind);
  if (!ok && t) showMediaPermissionDeniedAlert(t);
  return ok;
}

/**
 * Picks from gallery. Bypasses react-native-image-picker JS when TurboModule is null
 * but legacy NativeModules.ImagePicker is still registered (common after hot reload).
 */
export async function pickImageFromLibrary(
  options: ImageLibraryOptions,
  t?: (key: string) => string,
): Promise<ImagePickerResponse> {
  if (!(await ensureMediaPermission('gallery', t))) {
    return { didCancel: true, assets: [] };
  }
  const turbo = getTurboImagePicker();
  const legacy = getLegacyImagePicker();

  if (!turbo && !legacy) {
    throw new Error('IMAGE_PICKER_NATIVE_MODULE_MISSING');
  }

  const merged = withDefaults(options);

  if (!turbo && legacy) {
    return runLegacy(legacy, 'launchImageLibrary', merged);
  }

  const { launchImageLibrary } = await import('react-native-image-picker');
  return launchImageLibrary(merged);
}

/** Opens camera with the same Turbo / legacy fallback strategy. */
export async function pickImageFromCamera(
  options: CameraOptions,
  t?: (key: string) => string,
): Promise<ImagePickerResponse> {
  if (!(await ensureMediaPermission('camera', t))) {
    return { didCancel: true, assets: [] };
  }

  const turbo = getTurboImagePicker();
  const legacy = getLegacyImagePicker();

  if (!turbo && !legacy) {
    throw new Error('IMAGE_PICKER_NATIVE_MODULE_MISSING');
  }

  const merged = withDefaults(options);

  if (!turbo && legacy) {
    return runLegacy(legacy, 'launchCamera', merged);
  }

  const { launchCamera } = await import('react-native-image-picker');
  return launchCamera(merged);
}

export function showImagePickerUnavailableAlert(t: (key: string) => string) {
  const steps =
    Platform.OS === 'ios'
      ? t('kyc.nativeMissingStepsIos')
      : Platform.OS === 'android'
        ? t('kyc.nativeMissingStepsAndroid')
        : t('kyc.nativeMissingStepsGeneric');

  Alert.alert(t('kyc.nativeMissingTitle'), steps);
}
