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
import { getErrorMessage } from "@/utils/errors";

export function Base64Tool() {
  const [b64Input, setB64Input] = useState("");
  const [b64Output, setB64Output] = useState("");
  const { copy, isCopied } = useClipboard();

  const encodeBase64 = () => {
    try {
      setB64Output(btoa(b64Input));
      toast.success("Encoded successfully");
    } catch (err: unknown) {
      setB64Output(`[ERROR] Encoding failed:\n${getErrorMessage(err)}`);
    }
  };

  const decodeBase64 = () => {
    try {
      setB64Output(atob(b64Input));
      toast.success("Decoded successfully");
    } catch (err: unknown) {
      setB64Output(`[ERROR] Decoding failed:\n${getErrorMessage(err)}`);
      toast.error("Invalid Base64 string");
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Base64 Encoder / Decoder</CardTitle>
        <CardDescription className="text-xs">
          Convert raw text strings to and from Base64 hash standards
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4 min-h-[480px]">
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Input String
            </FieldLabel>
            <Textarea
              placeholder="Enter plain text or Base64 string..."
              value={b64Input}
              onChange={(e) => setB64Input(e.target.value)}
              className="min-h-[220px] flex-1 font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Base64 Output
              </FieldLabel>
              {b64Output && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    copy(b64Output, "default", {
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
              value={b64Output}
              className="min-h-[220px] flex-1 font-mono text-xs"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={decodeBase64} variant="outline" size="sm">
            Base64 Decode
          </Button>
          <Button onClick={encodeBase64} size="sm">
            Base64 Encode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
