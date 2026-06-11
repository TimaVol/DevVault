"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { ToolOutputColumn, ToolPanel } from "@/components/shared/tool-panel";
import { getErrorMessage } from "@/utils/errors";

export function JsonTool() {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonIndent, setJsonIndent] = useState<number>(2);

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
    <ToolPanel
      title="JSON Formatter"
      description="Format, minify, and validate JSON payloads"
      headerActions={
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
      }
      footer={
        <>
          <Button onClick={minifyJson} variant="outline" size="sm">
            Minify
          </Button>
          <Button onClick={formatJson} size="sm">
            Beautify
          </Button>
        </>
      }
    >
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
        <ToolOutputColumn
          label="Output"
          value={jsonOutput}
          placeholder="// Output will appear here"
          labelClassName="text-label-mono"
        />
      </div>
    </ToolPanel>
  );
}
