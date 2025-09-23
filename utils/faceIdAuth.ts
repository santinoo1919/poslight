import * as LocalAuthentication from "expo-local-authentication";

export interface FaceIdResult {
  success: boolean;
  error?: string;
}

export const useFaceId = async (): Promise<FaceIdResult> => {
  try {
    // Check if device supports biometric authentication
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      return {
        success: false,
        error: "Biometric authentication not available on this device",
      };
    }

    // Check if biometric authentication is enrolled
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      return {
        success: false,
        error: "No biometric authentication enrolled",
      };
    }

    // Get available authentication types
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    const hasFaceId = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
    );
    const hasTouchId = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FINGERPRINT
    );

    if (!hasFaceId && !hasTouchId) {
      return {
        success: false,
        error: "No biometric authentication available",
      };
    }

    // Perform authentication
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access POS Light",
      fallbackLabel: "Use passcode",
      cancelLabel: "Cancel",
    });

    return {
      success: result.success,
      error: result.success ? undefined : "Authentication failed",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const checkFaceIdAvailability = async (): Promise<{
  available: boolean;
  type: "face" | "fingerprint" | "none";
  enrolled: boolean;
}> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    const hasFaceId = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
    );
    const hasTouchId = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FINGERPRINT
    );

    // Debug logging to see what's happening
    console.log("🔍 Face ID Debug:", {
      compatible,
      enrolled,
      supportedTypes,
      hasFaceId,
      hasTouchId,
    });

    return {
      available: compatible && enrolled && (hasFaceId || hasTouchId),
      type: hasFaceId ? "face" : hasTouchId ? "fingerprint" : "none",
      enrolled,
    };
  } catch (error) {
    console.error("❌ Face ID Check Error:", error);
    return {
      available: false,
      type: "none",
      enrolled: false,
    };
  }
};
