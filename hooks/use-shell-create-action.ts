"use client";

import { createElement, useMemo } from "react";
import { ShellCreateButton } from "@/components/shared/shell-create-button";
import { useAppShell } from "@/hooks/use-app-shell";

export function useShellCreateAction(
  label: string,
  onCreate: () => void,
  options?: { disabled?: boolean },
) {
  const actions = useMemo(
    () =>
      createElement(ShellCreateButton, {
        label,
        onCreate,
        disabled: options?.disabled,
      }),
    [label, onCreate, options?.disabled],
  );

  useAppShell({ actions });
}
