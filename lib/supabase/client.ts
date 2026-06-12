import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/env/public";

export function createClient() {
  const supabaseEnv = getSupabasePublicEnv();
  if (!supabaseEnv) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set",
    );
  }

  return createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
}
