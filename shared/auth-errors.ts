export const AUTH_CALLBACK_ERRORS = {
  auth_callback_failed: "Sign in failed. Please try again.",
  reset_link_expired:
    "This reset link has expired. Please request a new one.",
  reset_link_invalid:
    "This reset link is invalid or has already been used. Please request a new one.",
} as const;

export type AuthCallbackErrorKey = keyof typeof AUTH_CALLBACK_ERRORS;

export function getAuthCallbackErrorMessage(key: string | undefined): string | null {
  if (!key) return null;
  if (key in AUTH_CALLBACK_ERRORS) {
    return AUTH_CALLBACK_ERRORS[key as AuthCallbackErrorKey];
  }
  return null;
}

export function resolveAuthCallbackErrorKey(
  errorCode: string | null,
  error: string | null,
  isPasswordReset: boolean,
): AuthCallbackErrorKey {
  if (errorCode === "otp_expired") {
    return isPasswordReset ? "reset_link_expired" : "auth_callback_failed";
  }

  if (error === "access_denied" && isPasswordReset) {
    return "reset_link_invalid";
  }

  return "auth_callback_failed";
}
