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
import { signInWithGoogle, signUp } from "@/features/auth/server/actions";
import { GoogleIcon } from "@/components/icons/google-icon";
import { SubmitButton } from "./submit-button";
import { ROUTES } from "@/shared/routes";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null);

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
        <CardTitle className="text-headline-md">Create workspace</CardTitle>
        <CardDescription>
          Sign up for your personal developer vault
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
              <FieldLabel htmlFor="password">
                <Lock className="size-3.5" />
                Password
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
            <SubmitButton label="Sign up" />
          </FieldGroup>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <form action={signInWithGoogle}>
          <Button type="submit" variant="secondary" className="w-full">
            <GoogleIcon data-icon="inline-start" />
            Continue with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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
