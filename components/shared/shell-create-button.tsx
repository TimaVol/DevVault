"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShellCreateButtonProps = {
  label: string;
  onCreate: () => void;
  disabled?: boolean;
};

export function ShellCreateButton({ label, onCreate, disabled }: ShellCreateButtonProps) {
  return (
    <Button onClick={onCreate} disabled={disabled} size="sm">
      <Plus data-icon="inline-start" />
      {label}
    </Button>
  );
}
