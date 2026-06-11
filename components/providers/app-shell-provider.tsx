"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  AppShellContext,
  type AppShellConfig,
} from "@/hooks/use-app-shell";

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [shell, setShellState] = useState<AppShellConfig>({});

  const setShell = useCallback((patch: Partial<AppShellConfig>) => {
    setShellState((prev) => {
      const next = {
        title: "title" in patch ? patch.title : prev.title,
        actions: "actions" in patch ? patch.actions : prev.actions,
      };
      if (prev.title === next.title && prev.actions === next.actions) {
        return prev;
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      mobileNavOpen,
      setMobileNavOpen,
      title: shell.title,
      actions: shell.actions,
      setShell,
    }),
    [mobileNavOpen, shell.title, shell.actions, setShell],
  );

  return (
    <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>
  );
}
