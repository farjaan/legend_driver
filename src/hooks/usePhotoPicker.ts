import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { Asset } from 'react-native-image-picker';
import {
  isImagePickerAvailable,
  pickImageFromCamera,
  pickImageFromLibrary,
  showImagePickerUnavailableAlert,
} from '@utils/mediaPicker';

export type CapturedImage = { uri: string; fileName?: string };

type UsePhotoPickerOptions = {
  t: (key: string) => string;
  cameraType?: 'front' | 'back';
  quality?: number;
};

export function usePhotoPicker({
  t,
  cameraType = 'back',
  quality = 0.85,
}: UsePhotoPickerOptions) {
  const [image, setImage] = useState<CapturedImage | null>(null);

  const applyPickerResult = useCallback(
    (
      result: {
        assets?: Asset[];
        didCancel?: boolean;
        errorCode?: string;
        errorMessage?: string;
      },
      onDone: (img: CapturedImage) => void,
    ) => {
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert(t('kyc.cameraErrorTitle'), result.errorMessage ?? t('kyc.cameraErrorGeneric'));
        return;
      }
      if (result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        onDone({ uri: asset.uri!, fileName: asset.fileName });
      }
    },
    [t],
  );

  const pickFromLibrary = useCallback(async () => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    try {
      const result = await pickImageFromLibrary({ mediaType: 'photo', quality }, t);
      applyPickerResult(result, setImage);
    } catch {
      showImagePickerUnavailableAlert(t);
    }
  }, [applyPickerResult, quality, t]);

  const pickFromCamera = useCallback(async () => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    try {
      const result = await pickImageFromCamera(
        {
          mediaType: 'photo',
          quality,
          cameraType,
          saveToPhotos: false,
        },
        t,
      );
      applyPickerResult(result, setImage);
    } catch {
      showImagePickerUnavailableAlert(t);
    }
  }, [applyPickerResult, cameraType, quality, t]);

  const promptPick = useCallback(() => {
    if (!isImagePickerAvailable()) {
      showImagePickerUnavailableAlert(t);
      return;
    }
    Alert.alert(t('kyc.uploadSource'), undefined, [
      { text: t('kyc.sourceCamera'), onPress: () => void pickFromCamera() },
      { text: t('kyc.sourceGallery'), onPress: () => void pickFromLibrary() },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  }, [pickFromCamera, pickFromLibrary, t]);

  return { image, setImage, pickFromLibrary, pickFromCamera, promptPick };
}
