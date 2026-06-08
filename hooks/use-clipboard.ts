"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

type CopyOptions = {
  successMessage?: string;
  emptyMessage?: string;
};

/**
 * Clipboard copy with transient "copied" tracking. Pass an id to track which
 * item was copied (e.g. a list of snippets); omit it for a single target.
 */
export function useClipboard(timeout = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    (text: string, id = "default", options?: CopyOptions) => {
      if (!text) {
        toast.error(options?.emptyMessage ?? "Nothing to copy!");
        return;
      }
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(options?.successMessage ?? "Copied to clipboard");
      setTimeout(() => setCopiedId(null), timeout);
    },
    [timeout],
  );

  const isCopied = useCallback((id = "default") => copiedId === id, [copiedId]);

  return { copy, copiedId, isCopied };
}
