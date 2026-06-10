"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/use-clipboard";
import { getErrorMessage } from "@/utils/errors";

export function JsonTool() {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonIndent, setJsonIndent] = useState<number>(2);
  const { copy, isCopied } = useClipboard();

  const formatJson = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, jsonIndent));
      toast.success("JSON Formatted successfully");
    } catch (err: unknown) {
      setJsonOutput(`[ERROR] Invalid JSON:\n${getErrorMessage(err)}`);
      toast.error("Invalid JSON input");
    }
  };

  const minifyJson = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      toast.success("JSON Minified");
    } catch (err: unknown) {
      setJsonOutput(`[ERROR] Invalid JSON:\n${getErrorMessage(err)}`);
      toast.error("Invalid JSON input");
    }
  };

  return (
    <div className="tonal-card flex h-full flex-col">
      <div className="flex flex-row items-start justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-headline-md font-display">JSON Formatter</h2>
          <p className="text-label-caps text-muted-foreground">
            Format, minify, and validate JSON payloads
          </p>
        </div>
        <Select
          value={String(jsonIndent)}
          onValueChange={(v) => v && setJsonIndent(Number(v))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 spaces</SelectItem>
            <SelectItem value="4">4 spaces</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex min-h-[480px] flex-1 flex-col space-y-4 px-6 py-6">
        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel className="text-label-mono uppercase text-muted-foreground">
              Input
            </FieldLabel>
            <Textarea
              placeholder='{ "key": "value" }'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="min-h-[280px] flex-1 border-border bg-input font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-label-mono uppercase text-muted-foreground">
                Output
              </FieldLabel>
              {jsonOutput && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    copy(jsonOutput, "default", {
                      successMessage: "Output copied to clipboard!",
                    })
                  }
                >
                  {isCopied() ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
            <Textarea
              readOnly
              placeholder="// Output will appear here"
              value={jsonOutput}
              className="min-h-[280px] flex-1 border-border bg-muted/20 font-mono text-xs"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button onClick={minifyJson} variant="outline" size="sm">
            Minify
          </Button>
          <Button onClick={formatJson} size="sm">
            Beautify
          </Button>
        </div>
      </div>
    </div>
  );
}
