"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";

const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

type AuthCaptchaProps = {
  resetKey: number;
  onTokenChange: (token: string | null) => void;
};

export function AuthCaptcha({ resetKey, onTokenChange }: AuthCaptchaProps) {
  if (!siteKey) {
    return null;
  }

  return (
    <HCaptcha
      key={resetKey}
      sitekey={siteKey}
      theme="dark"
      onVerify={onTokenChange}
      onExpire={() => onTokenChange(null)}
      onError={() => onTokenChange(null)}
    />
  );
}
