"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Braces, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/utils/errors";

export function JsonTool() {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonIndent, setJsonIndent] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    if (!text) {
      toast.error("Nothing to copy!");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Output copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

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
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>JSON Formatter & Validator</CardTitle>
          <CardDescription className="text-xs">
            Format, minify, and validate JSON payloads instantly
          </CardDescription>
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
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4 min-h-[480px]">
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Input Payload
            </FieldLabel>
            <Textarea
              placeholder='{ "key": "value" }'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="min-h-[220px] flex-1 font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Formatted Output
              </FieldLabel>
              {jsonOutput && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleCopy(jsonOutput)}
                >
                  {copied ? (
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
              className="min-h-[220px] flex-1 font-mono text-xs"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={minifyJson} variant="outline" size="sm">
            Minify JSON
          </Button>
          <Button onClick={formatJson} size="sm">
            Format JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
