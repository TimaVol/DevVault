"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn";
import { enterDemo } from "@/features/auth/server/actions";
import {
  CaptchaFormFields,
  useAuthCaptcha,
} from "@/features/auth/components/captcha-form-fields";
import { isCaptchaEnabled } from "@/features/auth/hooks/use-auth-captcha";

function StartDemoSubmit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending || disabled}>
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          Start demo
          <ArrowRight data-icon="inline-end" />
        </>
      )}
    </Button>
  );
}

export function ViewDemoButton() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(enterDemo, null);
  const {
    captchaToken,
    setCaptchaToken,
    captchaKey,
    resetCaptcha,
    captchaReady,
  } = useAuthCaptcha();

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      resetCaptcha();
    }
  }, [state, resetCaptcha]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      resetCaptcha();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        View Demo
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Try DevVault</DialogTitle>
            <DialogDescription>
              Explore the dashboard with a temporary demo session. No account
              required.
            </DialogDescription>
          </DialogHeader>

          <form action={formAction} className="space-y-4">
            {isCaptchaEnabled() ? (
              <div className="flex justify-center overflow-hidden rounded-lg border border-border bg-muted/30 p-3">
                <CaptchaFormFields
                  captchaKey={captchaKey}
                  captchaToken={captchaToken}
                  onTokenChange={setCaptchaToken}
                />
              </div>
            ) : null}
            <StartDemoSubmit disabled={!captchaReady} />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
