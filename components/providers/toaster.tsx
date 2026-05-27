"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "bg-surface-container-low border border-border-subtle text-foreground font-sans",
        },
      }}
    />
  );
}
