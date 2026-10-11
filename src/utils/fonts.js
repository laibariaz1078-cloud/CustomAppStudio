import { Platform } from 'react-native';
export const FONT_MAP = {
  System: undefined,
  Serif: Platform.select({ ios: 'Georgia', android: 'serif' }),
  Mono: Platform.select({ ios: 'Courier', android: 'monospace' }),
  Rounded: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium' }),
  Script: Platform.select({ ios: 'Snell Roundhand', android: 'cursive' }),
  Light: Platform.select({ ios: 'HelveticaNeue-Light', android: 'sans-serif-light' }),
};
export const FONT_NAMES = Object.keys(FONT_MAP);
export const resolveFont = (k) => FONT_MAP[k];
