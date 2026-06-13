"use client";

import { useEffect, useState } from "react";
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
  const debouncedChange = useDebouncedCallback(onDebouncedChange, debounceMs);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
