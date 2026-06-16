"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signIn, signInWithGoogle } from "@/features/auth/server/actions";
import { useAuthCallbackError } from "@/features/auth/hooks/use-auth-callback-error";
import {
  CaptchaFormFields,
  useAuthCaptcha,
} from "@/features/auth/components/captcha-form-fields";
import { GoogleIcon } from "@/components/icons/google-icon";
import { SubmitButton } from "./submit-button";
import { ROUTES } from "@/shared/routes";

export function SignInForm({ callbackError }: { callbackError?: string }) {
  const [state, formAction] = useActionState(signIn, null);
  const [googleState, googleFormAction] = useActionState(
    signInWithGoogle,
    null,
  );
  const {
    captchaToken,
    setCaptchaToken,
    captchaKey,
    resetCaptcha,
    captchaReady,
    captchaRequired,
  } = useAuthCaptcha();

  useAuthCallbackError(callbackError);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      resetCaptcha();
    }
  }, [state, resetCaptcha]);

  useEffect(() => {
    if (!googleState?.error) return;
    toast.error(googleState.error);
  }, [googleState]);

  return (
    <>
      <CardHeader className="pt-2">
        <CardTitle className="text-headline-md">Welcome back</CardTitle>
        <CardDescription>
          Sign in to manage snippets, projects, and notes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">
                <Mail className="size-3.5" />
                Email
              </FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">
                  <Lock className="size-3.5" />
                  Password
                </FieldLabel>
                <Link
                  href={ROUTES.forgotPassword}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </Field>
            {captchaRequired ? (
              <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                <CaptchaFormFields
                  captchaKey={captchaKey}
                  captchaToken={captchaToken}
                  onTokenChange={setCaptchaToken}
                />
              </div>
            ) : null}
            <SubmitButton label="Sign in" disabled={!captchaReady} />
          </FieldGroup>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <form action={googleFormAction}>
          <Button type="submit" variant="secondary" className="w-full">
            <GoogleIcon data-icon="inline-start" />
            Continue with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.signup}
            className="font-medium text-primary hover:underline"
          >
            Create account
          </Link>
        </p>
      </CardContent>
    </>
  );
}
