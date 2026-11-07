import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Privileged server operations require SUPABASE_SERVICE_ROLE_KEY explicitly (no fallback to public anon key)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isServerSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseServiceRoleKey &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseServiceRoleKey.includes("your-service-role")
  );
};

export const createServerSupabaseClient = () => {
  if (!isServerSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
