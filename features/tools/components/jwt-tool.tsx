"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ToolOutputColumn, ToolPanel } from "@/components/shared/tool-panel";
import { getErrorMessage } from "@/utils/errors";

export function JwtTool() {
  const [jwtInput, setJwtInput] = useState("");
  const [jwtHeader, setJwtHeader] = useState("");
  const [jwtPayload, setJwtPayload] = useState("");

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
      const headerDecoded = atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"));
      const payloadDecoded = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
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
    <ToolPanel
      title="JWT Token Decoder"
      description="Inspect JWT token headers, payload claims, and expiration details"
    >
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
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          value={jwtInput}
          onChange={(e) => setJwtInput(e.target.value)}
          className="min-h-20 font-mono text-xs"
        />
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
        <ToolOutputColumn
          label="JWT Header"
          value={jwtHeader}
          placeholder="// Encoded JWT header segment"
          labelClassName="text-primary"
          copyId="header"
        />
        <ToolOutputColumn
          label="JWT Payload"
          value={jwtPayload}
          placeholder="// Decoded JWT payload claims"
          labelClassName="text-secondary"
          copyId="payload"
        />
      </div>
    </ToolPanel>
  );
}
