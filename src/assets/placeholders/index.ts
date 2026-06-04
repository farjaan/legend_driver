/**
 * Bundled placeholder images — generated via `npm run generate:assets`
 */
export const PlaceholderImages = {
  carFront: require('./cars/car-front.png'),
  carBack: require('./cars/car-back.png'),
  carLeft: require('./cars/car-left.png'),
  carRight: require('./cars/car-right.png'),
  carInterior: require('./cars/car-interior.png'),
  damageScratch: require('./damage-scratch-1.png'),
  damageDent: require('./damage-dent-1.png'),
  signatureSample: require('./signature-sample.png'),
  driverAvatar: require('./driver-avatar.png'),
} as const;

export type VehicleImageKey = keyof Pick<
  typeof PlaceholderImages,
  'carFront' | 'carBack' | 'carLeft' | 'carRight' | 'carInterior'
>;

export const VEHICLE_IMAGE_BY_KEY: Record<VehicleImageKey, number> = {
  carFront: PlaceholderImages.carFront,
  carBack: PlaceholderImages.carBack,
  carLeft: PlaceholderImages.carLeft,
  carRight: PlaceholderImages.carRight,
  carInterior: PlaceholderImages.carInterior,
};

export const CAR_PHOTO_SET = [
  { key: 'front', label: 'Front', source: PlaceholderImages.carFront },
  { key: 'back', label: 'Rear', source: PlaceholderImages.carBack },
  { key: 'left', label: 'Left', source: PlaceholderImages.carLeft },
  { key: 'right', label: 'Right', source: PlaceholderImages.carRight },
  { key: 'interior', label: 'Interior', source: PlaceholderImages.carInterior },
] as const;
