"use client";

import { useCallback, useState } from "react";

const captchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

export function isCaptchaEnabled(): boolean {
  return Boolean(captchaSiteKey);
}

export function useAuthCaptcha() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaKey((key) => key + 1);
  }, []);

  const captchaRequired = isCaptchaEnabled();
  const captchaReady = !captchaRequired || Boolean(captchaToken);

  return {
    captchaToken,
    setCaptchaToken,
    captchaKey,
    resetCaptcha,
    captchaRequired,
    captchaReady,
  };
}
