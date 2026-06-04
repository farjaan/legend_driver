import React from 'react';
import FA from 'react-native-vector-icons/FontAwesome5';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

type Props = {
  name: string;
  size?: number;
  color?: string;
  solid?: boolean;
  style?: StyleProp<TextStyle>;
  /** Passed to the icon wrapper when needed */
  containerStyle?: StyleProp<ViewStyle>;
};

/** FontAwesome5 — fonts linked in iOS Info.plist + Android fonts.gradle */
export function AppIcon({ name, size = 22, color, solid, style }: Props) {
  return <FA name={name} size={size} color={color} solid={solid} style={style} />;
}
