"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ROUTES } from "@/shared/routes";
import { env, getSiteUrl } from "@/lib/env";
import { checkRateLimit, getClientIp } from "@/server/auth/rate-limit";
import { resolveCaptchaOptions } from "@/server/auth/captcha";
import {
  emailField,
  passwordField,
  resetPasswordSchema,
} from "@/server/validation/auth";

const credentialsSchema = z.object({
  email: emailField,
  password: passwordField,
});

const forgotPasswordSchema = z.object({
  email: emailField,
});

export type AuthState = {
  error?: string;
  message?: string;
} | null;

async function rateLimitAuth(action: string): Promise<AuthState | null> {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const allowed = await checkRateLimit(`${action}:${ip}`);

  if (!allowed) {
    return { error: "Too many attempts. Please try again later." };
  }

  return null;
}

export async function signIn(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const limited = await rateLimitAuth("sign-in");
  if (limited) return limited;

  const result = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const captcha = resolveCaptchaOptions(formData);
  if (!captcha.ok) return captcha.state;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
    options: captcha.options,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  revalidatePath("/", "layout");
  redirect(ROUTES.dashboard);
}

export async function signUp(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const limited = await rateLimitAuth("sign-up");
  if (limited) return limited;

  if (env.DISABLE_SIGNUP) {
    return { error: "Sign up is currently disabled." };
  }

  const result = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const captcha = resolveCaptchaOptions(formData);
  if (!captcha.ok) return captcha.state;

  const supabase = await createClient();
  const siteUrl = getSiteUrl();
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      ...captcha.options,
    },
  });

  if (error) {
    return { error: "Unable to create account. Please try again." };
  }

  return { message: "Check your email for the confirmation link!" };
}

export async function requestPasswordReset(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const limited = await rateLimitAuth("password-reset");
  if (limited) return limited;

  const result = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const captcha = resolveCaptchaOptions(formData);
  if (!captcha.ok) return captcha.state;

  const supabase = await createClient();
  const next = encodeURIComponent(ROUTES.resetPassword);
  const siteUrl = getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=${next}`,
    ...captcha.options,
  });

  if (error) {
    const isRateLimited =
      error.status === 429 ||
      error.message.toLowerCase().includes("rate limit");

    if (isRateLimited) {
      return {
        error:
          "Too many reset emails sent. Please wait a few minutes and try again.",
      };
    }

    console.error("[auth] resetPasswordForEmail failed:", error.message);
  }

  return {
    message:
      "If an account exists with that email, you will receive a reset link shortly.",
  };
}

export async function updatePassword(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const limited = await rateLimitAuth("update-password");
  if (limited) return limited;

  const result = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your reset session has expired. Please request a new link." };
  }

  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });

  if (error) {
    return { error: "Unable to update password. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect(ROUTES.dashboard);
}

export async function enterDemo(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const limited = await rateLimitAuth("demo");
  if (limited) return limited;

  const captcha = resolveCaptchaOptions(formData);
  if (!captcha.ok) return captcha.state;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInAnonymously({
    options: captcha.options,
  });

  if (error) {
    console.error("[auth] signInAnonymously failed:", error.message);
    return { error: "Unable to start demo. Please try again." };
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
  const siteUrl = getSiteUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
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
