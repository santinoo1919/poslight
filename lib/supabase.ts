import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://pqfhmqpzywiptvdcmipk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZmhtcXB6eXdpcHR2ZGNtaXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTEyMTcsImV4cCI6MjA3MzQyNzIxN30.40L9v3KxKsFVf18gyBQ11URuKa-dm1XE2A_1TcT56mw";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
