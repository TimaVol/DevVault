"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/utils/cn";

type FormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  contentClassName?: string;
  onBeforeClose?: () => void;
  children: React.ReactNode;
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  isLoading = false,
  contentClassName,
  onBeforeClose,
  children,
}: FormDialogProps) {
  const handleOpenChange = (next: boolean) => {
    if (!next) onBeforeClose?.();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl border-border bg-popover backdrop-blur-sm",
          contentClassName,
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <FieldGroup className="py-2">{children}</FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
