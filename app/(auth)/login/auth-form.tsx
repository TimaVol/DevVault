"use client";

import { useActionState, useState, useEffect } from "react";
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
import { authenticate, signInWithGoogle } from "./actions";
import { SubmitButton } from "./submit-button";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [state, formAction] = useActionState(authenticate, null);

  // After a successful signup the server returns a message; derive sign-in
  // mode from that so the UI switches without a setState call inside an effect.
  const mode = isSignUp && !state?.message ? "signup" : "signin";

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <>
      <CardHeader>
        <CardTitle>{mode === "signup" ? "Create workspace" : "Welcome back"}</CardTitle>
        <CardDescription>
          {mode === "signup"
            ? "Sign up for your personal developer vault"
            : "Sign in to manage snippets, projects, and notes"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction}>
          <input type="hidden" name="mode" value={mode} />
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
              />
            </Field>
            <SubmitButton isSignUp={mode === "signup"} />
          </FieldGroup>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline" className="w-full">
            Continue with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <button
            type="button"
            onClick={() => setIsSignUp(mode === "signin")}
            className="font-medium text-primary hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </p>
      </CardContent>
    </>
  );
}
