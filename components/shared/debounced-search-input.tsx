"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/utils/cn";

type DebouncedSearchInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange"
> & {
  value: string;
  onDebouncedChange: (value: string) => void;
  debounceMs?: number;
};

export function DebouncedSearchInput({
  value,
  onDebouncedChange,
  debounceMs = 300,
  className,
  ...props
}: DebouncedSearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [prevExternalValue, setPrevExternalValue] = useState(value);
  const debouncedChange = useDebouncedCallback(onDebouncedChange, debounceMs);

  if (value !== prevExternalValue) {
    setPrevExternalValue(value);
    setLocalValue(value);
  }

  return (
    <Input
      {...props}
      value={localValue}
      onChange={(e) => {
        const next = e.target.value;
        setLocalValue(next);
        debouncedChange(next);
      }}
      className={cn(className)}
    />
  );
}
