"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ToolIoColumns, ToolPanel } from "@/components/shared/tool-panel";
import { getErrorMessage } from "@/utils/errors";

export function Base64Tool() {
  const [b64Input, setB64Input] = useState("");
  const [b64Output, setB64Output] = useState("");

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
    <ToolPanel
      title="Base64 Encoder / Decoder"
      description="Convert raw text strings to and from Base64 hash standards"
      footer={
        <>
          <Button onClick={decodeBase64} variant="outline" size="sm">
            Base64 Decode
          </Button>
          <Button onClick={encodeBase64} size="sm">
            Base64 Encode
          </Button>
        </>
      }
    >
      <ToolIoColumns
        inputValue={b64Input}
        outputValue={b64Output}
        onInputChange={setB64Input}
        inputPlaceholder="Enter plain text or Base64 string..."
        outputLabel="Base64 Output"
      />
    </ToolPanel>
  );
}
