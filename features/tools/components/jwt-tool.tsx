"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
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

export function JwtTool() {
  const [jwtInput, setJwtInput] = useState("");
  const [jwtHeader, setJwtHeader] = useState("");
  const [jwtPayload, setJwtPayload] = useState("");
  const { copy, isCopied } = useClipboard();

  const decodeJwt = () => {
    if (!jwtInput.trim()) return;
    const parts = jwtInput.split(".");
    if (parts.length !== 3) {
      toast.error("Invalid JWT format (must have 3 parts)");
      setJwtHeader("");
      setJwtPayload("[ERROR] Invalid JWT format");
      return;
    }

    try {
      const headerDecoded = atob(
        parts[0].replace(/-/g, "+").replace(/_/g, "/"),
      );
      const payloadDecoded = atob(
        parts[1].replace(/-/g, "+").replace(/_/g, "/"),
      );
      setJwtHeader(JSON.stringify(JSON.parse(headerDecoded), null, 2));
      setJwtPayload(JSON.stringify(JSON.parse(payloadDecoded), null, 2));
      toast.success("JWT decoded successfully");
    } catch (err: unknown) {
      setJwtHeader("");
      setJwtPayload(`[ERROR] JWT Decoding failed:\n${getErrorMessage(err)}`);
      toast.error("Failed to decode token");
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>JWT Token Decoder</CardTitle>
        <CardDescription className="text-xs">
          Inspect JWT token headers, payload claims, and expiration details
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4 min-h-[480px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Encoded JWT Token
            </FieldLabel>
            <Button onClick={decodeJwt} size="sm">
              <RefreshCw className="mr-1 h-3 w-3" /> Decode Token
            </Button>
          </div>
          <Textarea
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            value={jwtInput}
            onChange={(e) => setJwtInput(e.target.value)}
            className="min-h-20 font-mono text-xs"
          />
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-medium uppercase tracking-wider text-primary">
                JWT Header
              </FieldLabel>
              {jwtHeader && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    copy(jwtHeader, "header", {
                      successMessage: "Output copied to clipboard!",
                    })
                  }
                >
                  {isCopied("header") ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
            <Textarea
              readOnly
              placeholder="// Encoded JWT header segment"
              value={jwtHeader}
              className="min-h-[160px] flex-1 font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-medium uppercase tracking-wider text-secondary">
                JWT Payload
              </FieldLabel>
              {jwtPayload && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    copy(jwtPayload, "payload", {
                      successMessage: "Output copied to clipboard!",
                    })
                  }
                >
                  {isCopied("payload") ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
            <Textarea
              readOnly
              placeholder="// Decoded JWT payload claims"
              value={jwtPayload}
              className="min-h-[160px] flex-1 font-mono text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
