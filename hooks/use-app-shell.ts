"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

export type AppShellConfig = {
  title?: string;
  actions?: ReactNode;
};

export type AppShellContextValue = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  title?: string;
  actions?: ReactNode;
  setShell: (config: Partial<AppShellConfig>) => void;
};

export const AppShellContext = createContext<AppShellContextValue | null>(null);

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
