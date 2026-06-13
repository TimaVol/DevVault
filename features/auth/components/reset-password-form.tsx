"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/features/auth/server/actions";
import { SubmitButton } from "@/features/auth/components/submit-button";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(updatePassword, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <>
      <CardHeader className="pt-2">
        <CardTitle className="text-headline-md">Set new password</CardTitle>
        <CardDescription>
          Choose a strong password for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">
                <Lock className="size-3.5" />
                New password
              </FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                <Lock className="size-3.5" />
                Confirm password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </Field>
            <SubmitButton label="Update password" />
          </FieldGroup>
        </form>
      </CardContent>
    </>
  );
}
