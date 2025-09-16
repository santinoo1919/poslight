import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Runtime guard with detailed error information
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  
  const errorDetails = {
    missingVariables: missingVars,
    availableEnvVars: Object.keys(process.env).filter(key => key.startsWith('EXPO_PUBLIC_')),
    supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
    supabaseAnonKey: supabaseAnonKey ? 'SET' : 'MISSING',
    nodeEnv: process.env.NODE_ENV,
    platform: process.env.EXPO_PLATFORM || 'unknown'
  };
  
  console.error('🚨 Supabase Environment Error:', errorDetails);
  
  throw new Error(
    `Missing Supabase environment variables: ${missingVars.join(', ')}. ` +
    `Available EXPO_PUBLIC vars: ${errorDetails.availableEnvVars.join(', ')}. ` +
    `Platform: ${errorDetails.platform}, NODE_ENV: ${errorDetails.nodeEnv}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Debug log to confirm successful initialization
console.log('✅ Supabase client initialized successfully', {
  url: supabaseUrl.substring(0, 30) + '...',
  keyLength: supabaseAnonKey?.length || 0,
  platform: process.env.EXPO_PLATFORM || 'unknown'
});
