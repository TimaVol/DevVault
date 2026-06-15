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

function StartDemoSubmit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
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

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        View Demo
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Try DevVault</DialogTitle>
            <DialogDescription>
              Explore the dashboard with a temporary demo session. No account
              required.
            </DialogDescription>
          </DialogHeader>

          <form action={formAction}>
            <StartDemoSubmit />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
