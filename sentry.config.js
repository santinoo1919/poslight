// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/react-native";

// Debug environment variables
console.log("🔍 Environment check:");
console.log(
  "EXPO_PUBLIC_SENTRY_DSN:",
  process.env.EXPO_PUBLIC_SENTRY_DSN ? "✅ Set" : "❌ Missing"
);
console.log(
  "EXPO_PUBLIC_REVENUECAT_IOS_API_KEY:",
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ? "✅ Set" : "❌ Missing"
);

// Initialize Sentry with debugging enabled
if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
  try {
    console.log("🔄 Initializing Sentry...");
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      debug: true, // Enable debug mode to see Sentry errors
      tracesSampleRate: 1.0,
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event) {
        console.log("📤 Sentry sending event:", event);
        return event;
      },
    });
    console.log("✅ Sentry initialized successfully");
  } catch (error) {
    console.error("❌ Sentry initialization failed:", error);
  }
} else {
  console.error("❌ Sentry DSN not available - skipping Sentry initialization");
}
