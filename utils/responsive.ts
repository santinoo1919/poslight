import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Enhanced responsive breakpoints
export const isSmallDevice: boolean = width < 375;
export const isMediumDevice: boolean = width >= 375 && width < 768;
export const isLargeDevice: boolean = width >= 768;

// iPad-specific breakpoints
export const isIPad = Platform.OS === "ios" && Platform.isPad;
export const isIPadMini = isIPad && width < 768;
export const isIPadAir = isIPad && width >= 768 && width < 1024;
export const isIPadPro = isIPad && width >= 1024;

// Device type detection
export const getDeviceType = () => {
  if (isIPadPro) return "iPadPro";
  if (isIPadAir) return "iPadAir";
  if (isIPadMini) return "iPadMini";
  if (isIPad) return "iPad";
  if (isLargeDevice) return "Large";
  if (isMediumDevice) return "Medium";
  return "Small";
};

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

// Responsive font size classes - device-specific scaling
export const getResponsiveFontSize = (baseClass: string): string => {
  if (isIPadPro) {
    // iPad Pro: largest text
    if (baseClass === "text-xs") return "text-sm";
    if (baseClass === "text-sm") return "text-base";
    if (baseClass === "text-base") return "text-lg";
    if (baseClass === "text-lg") return "text-xl";
    return "text-lg";
  }
  if (isIPadAir) {
    // iPad Air: large text
    if (baseClass === "text-xs") return "text-sm";
    if (baseClass === "text-sm") return "text-base";
    if (baseClass === "text-base") return "text-lg";
    return "text-base";
  }
  if (isIPadMini) {
    // iPad Mini: medium-large text
    if (baseClass === "text-xs") return "text-sm";
    if (baseClass === "text-sm") return "text-base";
    return "text-sm";
  }
  if (isSmallDevice) {
    // Small phones: smaller text
    if (baseClass === "text-base") return "text-sm";
    if (baseClass === "text-sm") return "text-xs";
    return "text-xs";
  }
  return baseClass; // Default for medium/large phones
};

// Dynamic grid columns based on screen size - 3 columns for all iPads
export const getGridColumns = (): number => {
  if (isIPad) return 3; // 3 columns for all iPads - consistent retail experience
  if (isLargeDevice) return 3; // 3 columns for large phones
  if (isMediumDevice) return 2; // 2 columns for medium phones
  return 2; // 2 columns for small phones
};

// Touch target optimization (Apple HIG: minimum 44pt)
export const getTouchTargetSize = (): string => {
  if (isIPad) return "min-h-12 min-w-12"; // 48pt for iPad
  return "min-h-11 min-w-11"; // 44pt for iPhone
};

// Keypad button sizing - device-specific
export const getKeypadButtonSize = (): string => {
  if (isIPadPro) return "w-20 h-20"; // Largest buttons for iPad Pro
  if (isIPadAir) return "w-18 h-18"; // Large buttons for iPad Air
  if (isIPadMini) return "w-16 h-16"; // Medium buttons for iPad Mini
  return "w-16 h-16"; // Standard size for phones
};

// Keypad button sizing class for platform
// Web: use explicit pixel sizes and prevent shrinking to avoid layout collapse
// Native: keep flexible square buttons with minimum touch target
export const getKeypadButtonClass = (): string => {
  if (Platform.OS === "web") {
    // Fill grid cell width, keep square, tiny gaps handled by container
    return "w-full aspect-square shrink-0";
  }
  // On native, preserve flexible grid with square aspect and minimum touch target
  const touchTarget = getTouchTargetSize();
  return `${touchTarget} flex-1 aspect-square`;
};

// Adaptive spacing multiplier - device-specific
export const getAdaptiveSpacing = (base: number): number => {
  if (isIPadPro) return base * 1.5; // Most spacing for iPad Pro
  if (isIPadAir) return base * 1.3; // Good spacing for iPad Air
  if (isIPadMini) return base * 1.1; // Moderate spacing for iPad Mini
  return base; // Standard spacing for phones
};

// Product card spacing - device-specific
export const getProductCardSpacing = (): string => {
  if (isIPadPro) return "p-3"; // Most padding for iPad Pro
  if (isIPadAir) return "p-2"; // Good padding for iPad Air
  if (isIPadMini) return "p-2"; // Good padding for iPad Mini
  return "p-1"; // Standard padding for phones
};
