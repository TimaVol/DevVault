"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

type SubmitButtonProps = {
  isSignUp?: boolean;
  label?: string;
  disabled?: boolean;
};

export function SubmitButton({ isSignUp, label, disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const text =
    label ?? (isSignUp ? "Sign up" : "Sign in");

  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          {text}
          <ArrowRight />
        </>
      )}
    </Button>
  );
}
