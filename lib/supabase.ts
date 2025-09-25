import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Make Supabase optional - only initialize if environment variables are provided
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.log("ℹ️ Supabase not configured - running in offline-only mode");
}

// Only create Supabase client if environment variables are provided
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Debug log to confirm initialization status
if (isSupabaseConfigured) {
  console.log("✅ Supabase client initialized successfully", {
    url: supabaseUrl!.substring(0, 30) + "...",
    keyLength: supabaseAnonKey!.length,
    platform: process.env.EXPO_PLATFORM || "unknown",
  });
} else {
  console.log("ℹ️ Supabase client not initialized - running offline-only");
}
