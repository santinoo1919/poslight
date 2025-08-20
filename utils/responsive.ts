import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Responsive breakpoints
export const isSmallDevice: boolean = width < 375;
export const isMediumDevice: boolean = width >= 375 && width < 768;
export const isLargeDevice: boolean = width >= 768;

// Platform-specific values
export const getPlatformValue = <T>(ios: T, android: T, web?: T): T => {
  if (Platform.OS === "ios") return ios;
  if (Platform.OS === "android") return android;
  return web || ios; // Default to iOS value for web
};

// Responsive spacing
export const getResponsiveSpacing = (
  small: number,
  medium: number,
  large: number
): number => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

// Responsive font sizes
export const getResponsiveFontSize = (baseSize: number): number => {
  if (isSmallDevice) return baseSize - 2;
  if (isMediumDevice) return baseSize;
  return baseSize + 2;
};
