"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type AppShellConfig = {
  title?: string;
  actions?: ReactNode;
};

type ShellSnapshot = {
  title?: string;
  actions?: ReactNode;
  version: number;
};

let shellSnapshot: ShellSnapshot = { version: 0 };
const shellListeners = new Set<() => void>();

function subscribeShell(listener: () => void) {
  shellListeners.add(listener);
  return () => shellListeners.delete(listener);
}

function getShellSnapshot() {
  return shellSnapshot;
}

function emitShellChange() {
  shellListeners.forEach((listener) => listener());
}

function patchShell(patch: Partial<AppShellConfig>) {
  const nextTitle = "title" in patch ? patch.title : shellSnapshot.title;
  const nextActions = "actions" in patch ? patch.actions : shellSnapshot.actions;

  if (shellSnapshot.title === nextTitle && shellSnapshot.actions === nextActions) {
    return;
  }

  shellSnapshot = {
    title: nextTitle,
    actions: nextActions,
    version: shellSnapshot.version + 1,
  };
  emitShellChange();
}

type AppShellContextValue = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const value = useMemo(
    () => ({ mobileNavOpen, setMobileNavOpen }),
    [mobileNavOpen],
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

export function useAppShellStore() {
  return useSyncExternalStore(subscribeShell, getShellSnapshot, getShellSnapshot);
}

export function useAppShell({ title, actions }: AppShellConfig) {
  useEffect(() => {
    patchShell({ title, actions });
    return () => patchShell({ title: undefined, actions: undefined });
  }, [title, actions]);
}
