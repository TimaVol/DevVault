"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ToolIoColumns, ToolPanel } from "@/components/shared/tool-panel";

export function UrlTool() {
  const [urlInput, setUrlInput] = useState("");
  const [urlOutput, setUrlOutput] = useState("");

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
    <ToolPanel
      title="URL Encoder / Decoder"
      description="Convert raw text string formatting safely to and from RFC web parameters"
      footer={
        <>
          <Button onClick={decodeUrl} variant="outline" size="sm">
            URL Decode
          </Button>
          <Button onClick={encodeUrl} size="sm">
            URL Encode
          </Button>
        </>
      }
    >
      <ToolIoColumns
        inputValue={urlInput}
        outputValue={urlOutput}
        onInputChange={setUrlInput}
        inputPlaceholder="Enter URL queries or parameter string..."
        outputLabel="URL Output"
      />
    </ToolPanel>
  );
}
