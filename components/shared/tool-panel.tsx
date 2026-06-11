"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/utils/cn";

type ToolPanelProps = {
  title: string;
  description: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function ToolPanel({
  title,
  description,
  headerActions,
  footer,
  children,
}: ToolPanelProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        className={cn(
          headerActions && "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
        )}
      >
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        {headerActions}
      </CardHeader>
      <CardContent className="flex min-h-[480px] flex-1 flex-col space-y-4">
        {children}
        {footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}

type ToolIoColumnsProps = {
  inputLabel?: string;
  outputLabel?: string;
  inputValue: string;
  outputValue: string;
  onInputChange: (value: string) => void;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  copySuccessMessage?: string;
};

export function ToolIoColumns({
  inputLabel = "Input String",
  outputLabel = "Output",
  inputValue,
  outputValue,
  onInputChange,
  inputPlaceholder,
  outputPlaceholder = "// Result will appear here",
  copySuccessMessage = "Output copied to clipboard!",
}: ToolIoColumnsProps) {
  const { copy, isCopied } = useClipboard();

  return (
    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {inputLabel}
        </FieldLabel>
        <Textarea
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="min-h-[220px] flex-1 font-mono text-xs"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {outputLabel}
          </FieldLabel>
          {outputValue ? (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => copy(outputValue, "default", { successMessage: copySuccessMessage })}
            >
              {isCopied() ? (
                <Check className="h-3 w-3 text-primary" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          ) : null}
        </div>
        <Textarea
          readOnly
          placeholder={outputPlaceholder}
          value={outputValue}
          className="min-h-[220px] flex-1 font-mono text-xs"
        />
      </div>
    </div>
  );
}

type ToolOutputColumnProps = {
  label: string;
  value: string;
  placeholder?: string;
  labelClassName?: string;
  copyId?: string;
  copySuccessMessage?: string;
};

export function ToolOutputColumn({
  label,
  value,
  placeholder,
  labelClassName,
  copyId = "default",
  copySuccessMessage = "Output copied to clipboard!",
}: ToolOutputColumnProps) {
  const { copy, isCopied } = useClipboard();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <FieldLabel
          className={cn(
            "text-xs font-medium uppercase tracking-wider text-muted-foreground",
            labelClassName,
          )}
        >
          {label}
        </FieldLabel>
        {value ? (
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => copy(value, copyId, { successMessage: copySuccessMessage })}
          >
            {isCopied(copyId) ? (
              <Check className="h-3 w-3 text-primary" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        ) : null}
      </div>
      <Textarea
        readOnly
        placeholder={placeholder}
        value={value}
        className="min-h-[160px] flex-1 font-mono text-xs"
      />
    </div>
  );
}
