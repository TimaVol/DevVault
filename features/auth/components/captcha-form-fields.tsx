"use client";

import { AuthCaptcha } from "@/features/auth/components/auth-captcha";
import { useAuthCaptcha } from "@/features/auth/hooks/use-auth-captcha";

type CaptchaFormFieldsProps = {
  captchaKey: number;
  captchaToken: string | null;
  onTokenChange: (token: string | null) => void;
};

export function CaptchaFormFields({
  captchaKey,
  captchaToken,
  onTokenChange,
}: CaptchaFormFieldsProps) {
  return (
    <div className="flex w-full justify-center overflow-hidden">
      <AuthCaptcha resetKey={captchaKey} onTokenChange={onTokenChange} />
      <input type="hidden" name="captchaToken" value={captchaToken ?? ""} />
    </div>
  );
}

export { useAuthCaptcha };
