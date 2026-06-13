"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ROUTES } from "@/shared/routes";
import { env, getSiteUrl } from "@/lib/env";
import { checkRateLimit, getClientIp } from "@/server/auth/rate-limit";
import { LIMITS } from "@/server/validation/limits";

const AUTH_RATE_LIMIT = { maxAttempts: 10, windowMs: 15 * 60 * 1000 };

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(LIMITS.password, "Password is too long")
  .regex(/[a-zA-Z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

const authenticateFormSchema = z.object({
  mode: z.enum(["signin", "signup"]),
  email: z
    .string()
    .email("Invalid email address")
    .max(LIMITS.email, "Email is too long"),
  password: passwordField,
});

type AuthState = {
  error?: string;
  message?: string;
} | null;

async function rateLimitAuth(action: string): Promise<AuthState | null> {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const allowed = checkRateLimit(
    `${action}:${ip}`,
    AUTH_RATE_LIMIT.maxAttempts,
    AUTH_RATE_LIMIT.windowMs,
  );

  if (!allowed) {
    return { error: "Too many attempts. Please try again later." };
  }

  return null;
}

export async function authenticate(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const limited = await rateLimitAuth("authenticate");
  if (limited) return limited;

  const result = authenticateFormSchema.safeParse({
    mode: formData.get("mode"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  if (result.data.mode === "signup" && env.DISABLE_SIGNUP) {
    return { error: "Sign up is currently disabled." };
  }

  const supabase = await createClient();

  if (result.data.mode === "signup") {
    const { error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      },
    });

    if (error) {
      return { error: "Unable to create account. Please try again." };
    }

    return { message: "Check your email for the confirmation link!" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  revalidatePath("/", "layout");
  redirect(ROUTES.dashboard);
}

export async function signInWithGoogle() {
  const limited = await rateLimitAuth("google");
  if (limited) {
    throw new Error(limited.error);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error || !data.url) {
    throw new Error("Failed to initiate Google sign-in");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(ROUTES.login);
}
