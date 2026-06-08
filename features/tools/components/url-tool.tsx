"use client";

import { useState } from "react";
import { toast } from "sonner";
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

export function UrlTool() {
  const [urlInput, setUrlInput] = useState("");
  const [urlOutput, setUrlOutput] = useState("");
  const { copy, isCopied } = useClipboard();

  const encodeUrl = () => {
    try {
      setUrlOutput(encodeURIComponent(urlInput));
      toast.success("URL Encoded");
    } catch {
      setUrlOutput("[ERROR] Failed to encode");
    }
  };

  const decodeUrl = () => {
    try {
      setUrlOutput(decodeURIComponent(urlInput));
      toast.success("URL Decoded");
    } catch {
      setUrlOutput("[ERROR] Failed to decode");
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>URL Encoder / Decoder</CardTitle>
        <CardDescription className="text-xs">
          Convert raw text string formatting safely to and from RFC web
          parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4 min-h-[480px]">
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Input String
            </FieldLabel>
            <Textarea
              placeholder="Enter URL queries or parameter string..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="min-h-[220px] flex-1 font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                URL Output
              </FieldLabel>
              {urlOutput && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    copy(urlOutput, "default", {
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
              placeholder="// Result will appear here"
              value={urlOutput}
              className="min-h-[220px] flex-1 font-mono text-xs"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={decodeUrl} variant="outline" size="sm">
            URL Decode
          </Button>
          <Button onClick={encodeUrl} size="sm">
            URL Encode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
