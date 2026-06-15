import type { AuthState } from "@/features/auth/server/actions";

export type CaptchaAuthOptions = {
  captchaToken?: string;
};

export function resolveCaptchaOptions(
  formData: FormData,
): { ok: true; options: CaptchaAuthOptions } | { ok: false; state: AuthState } {
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  if (!siteKey) {
    return { ok: true, options: {} };
  }

  const token = formData.get("captchaToken");
  if (typeof token !== "string" || !token.trim()) {
    return {
      ok: false,
      state: { error: "Please complete the CAPTCHA verification." },
    };
  }

  return { ok: true, options: { captchaToken: token } };
}
