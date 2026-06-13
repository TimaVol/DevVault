import { decodeJwt } from "jose";
import { createClient } from "@/lib/supabase/server";
import { admin, client, createDrizzle } from "@/lib/db";
import type { SupabaseToken } from "@/lib/db";
import type { User } from "@supabase/supabase-js";

export type DrizzleSupabaseContext = {
  rls: ReturnType<typeof createDrizzle>["rls"];
  user: User;
};

function buildSupabaseToken(
  user: User,
  accessToken: string | undefined,
): SupabaseToken {
  const decoded = accessToken
    ? (decodeJwt(accessToken) as SupabaseToken)
    : {};

  return {
    ...decoded,
    sub: decoded.sub ?? user.id,
    role: "authenticated",
    email: decoded.email ?? user.email ?? undefined,
  };
}

export async function createDrizzleSupabaseClient(): Promise<DrizzleSupabaseContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // getUser() validates the session server-side. getSession() is only used
  // afterward to read the JWT access token for RLS claims — not for auth.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = buildSupabaseToken(user, session?.access_token);

  const { rls } = createDrizzle(token, { admin, client });

  return { rls, user };
}
