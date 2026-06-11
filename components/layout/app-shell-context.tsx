"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AppShellConfig = {
  title?: string;
  actions?: ReactNode;
};

type AppShellContextValue = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  title?: string;
  actions?: ReactNode;
  setShell: (config: Partial<AppShellConfig>) => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

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

export function useAppShellContext() {
  const ctx = useContext(AppShellContext);
  if (!ctx) {
    throw new Error("useAppShellContext must be used within AppShellProvider");
  }
  return ctx;
}

export function useAppShell({ title, actions }: AppShellConfig = {}) {
  const { setShell } = useAppShellContext();

  useEffect(() => {
    if (title === undefined && actions === undefined) return;
    setShell({ title, actions });
    return () => setShell({ title: undefined, actions: undefined });
  }, [title, actions, setShell]);
}
