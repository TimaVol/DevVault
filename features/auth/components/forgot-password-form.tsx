"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/features/auth/server/actions";
import { useAuthCallbackError } from "@/features/auth/hooks/use-auth-callback-error";
import { SubmitButton } from "@/features/auth/components/submit-button";
import { ROUTES } from "@/shared/routes";

export function ForgotPasswordForm({
  callbackError,
}: {
  callbackError?: string;
}) {
  const [state, formAction] = useActionState(requestPasswordReset, null);

  useAuthCallbackError(callbackError);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <>
      <CardHeader className="pt-2">
        <CardTitle className="text-headline-md">Reset password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to set a new password
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
            <SubmitButton label="Send reset link" />
          </FieldGroup>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href={ROUTES.login}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </>
  );
}
