"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Braces,
  Check,
  Code,
  Copy,
  Hash,
  Key,
  Link2,
  RefreshCw,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/utils/errors";

type ActiveTool = "json" | "base64" | "jwt" | "url" | "regex";

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("json");
  const [copied, setCopied] = useState(false);

  // Common Copy Tool output
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

  // State & handlers for JSON Formatter
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

  // State & handlers for Base64
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

  // State & handlers for JWT Decoder
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

  // State & handlers for URL
  const [urlInput, setUrlInput] = useState("");
  const [urlOutput, setUrlOutput] = useState("");

  const encodeUrl = () => {
    try {
      setUrlOutput(encodeURIComponent(urlInput));
      toast.success("URL Encoded");
    } catch (err) {
      setUrlOutput(`[ERROR] Failed to encode`);
    }
  };

  const decodeUrl = () => {
    try {
      setUrlOutput(decodeURIComponent(urlInput));
      toast.success("URL Decoded");
    } catch (err) {
      setUrlOutput(`[ERROR] Failed to decode`);
    }
  };

  // State & handlers for Regex
  const [regexPattern, setRegexPattern] = useState("");
  const [regexText, setRegexText] = useState("");
  const [regexFlags, setRegexFlags] = useState("g");
  const [regexMatches, setRegexMatches] = useState<string[]>([]);

  const testRegex = () => {
    if (!regexPattern) return;
    try {
      const regex = new RegExp(regexPattern, regexFlags);
      const matches: string[] = [];
      let match;
      
      if (regexFlags.includes("g")) {
        while ((match = regex.exec(regexText)) !== null) {
          matches.push(match[0]);
          if (regex.lastIndex === match.index) {
            regex.lastIndex++; // Prevent infinite loops for empty matches
          }
        }
      } else {
        match = regexText.match(regex);
        if (match) matches.push(match[0]);
      }

      setRegexMatches(matches);
      toast.success(`Regex matched ${matches.length} instances`);
    } catch (err: unknown) {
      setRegexMatches([`[ERROR] Invalid Regex: ${getErrorMessage(err)}`]);
      toast.error("Invalid Regex pattern");
    }
  };

  const menuItems = [
    { id: "json" as ActiveTool, label: "JSON Formatter", icon: Braces },
    { id: "base64" as ActiveTool, label: "Base64 Encoder", icon: Hash },
    { id: "jwt" as ActiveTool, label: "JWT Decoder", icon: Key },
    { id: "url" as ActiveTool, label: "URL Encoder", icon: Link2 },
    { id: "regex" as ActiveTool, label: "Regex Tester", icon: Code },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Developer tools"
        description="Built-in utilities for everyday tasks."
      />
      <div className="flex flex-col gap-6 md:flex-row">
      <aside className="w-full shrink-0 md:w-56">
        <Tabs
          value={activeTool}
          onValueChange={(v) => setActiveTool(v as ActiveTool)}
          orientation="vertical"
          className="w-full"
        >
          <TabsList className="flex h-auto w-full flex-row gap-1 overflow-x-auto md:flex-col">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="shrink-0 justify-start gap-2 px-3 py-2.5 text-xs uppercase"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </aside>

      {/* Main workspace */}
      <div className="flex-1 min-w-0">
        
        {/* JSON Tool Content */}
        {activeTool === "json" && (
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>JSON Formatter & Validator</CardTitle>
                <CardDescription className="text-xs">Format, minify, and validate JSON payloads instantly</CardDescription>
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
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Input */}
                <div className="flex flex-col gap-2">
                  <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Input Payload</FieldLabel>
                  <Textarea
                    placeholder='{ "key": "value" }'
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-[220px] flex-1 font-mono text-xs"
                  />
                </div>
                {/* Output */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Formatted Output</FieldLabel>
                    {jsonOutput && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleCopy(jsonOutput)}
                      >
                        {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
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
              <div className="flex gap-2 justify-end mt-4">
                <Button onClick={minifyJson} variant="outline" size="sm">
                  Minify JSON
                </Button>
                <Button onClick={formatJson} size="sm">
                  Format JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Base64 Content */}
        {activeTool === "base64" && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Base64 Encoder / Decoder</CardTitle>
              <CardDescription className="text-xs">Convert raw text strings to and from Base64 hash standards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Input String</FieldLabel>
                  <Textarea
                    placeholder="Enter plain text or Base64 string..."
                    value={b64Input}
                    onChange={(e) => setB64Input(e.target.value)}
                    className="min-h-[220px] flex-1 font-mono text-xs"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Base64 Output</FieldLabel>
                    {b64Output && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleCopy(b64Output)}
                      >
                        {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
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
              <div className="flex gap-2 justify-end mt-4">
                <Button onClick={decodeBase64} variant="outline" size="sm">
                  Base64 Decode
                </Button>
                <Button onClick={encodeBase64} size="sm">
                  Base64 Encode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* JWT Decoder Content */}
        {activeTool === "jwt" && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>JWT Token Decoder</CardTitle>
              <CardDescription className="text-xs">Inspect JWT token headers, payload claims, and expiration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Encoded JWT Token</FieldLabel>
                  <Button onClick={decodeJwt} size="sm">
                    <RefreshCw className="h-3 w-3 mr-1" /> Decode Token
                  </Button>
                </div>
                <Textarea
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  className="min-h-20 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <FieldLabel className="text-xs font-medium uppercase tracking-wider text-primary">
                      JWT Header
                    </FieldLabel>
                    {jwtHeader && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleCopy(jwtHeader)}
                      >
                        {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
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

                {/* Payload */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <FieldLabel className="text-xs font-medium uppercase tracking-wider text-secondary">
                      JWT Payload
                    </FieldLabel>
                    {jwtPayload && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleCopy(jwtPayload)}
                      >
                        {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    readOnly
                    placeholder="// Decoded JWT payload payload claims"
                    value={jwtPayload}
                    className="min-h-[160px] flex-1 font-mono text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* URL Content */}
        {activeTool === "url" && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>URL Encoder / Decoder</CardTitle>
              <CardDescription className="text-xs">Convert raw text string formatting safely to and from RFC web parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Input String</FieldLabel>
                  <Textarea
                    placeholder="Enter URL queries or parameter string..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="min-h-[220px] flex-1 font-mono text-xs"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">URL Output</FieldLabel>
                    {urlOutput && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleCopy(urlOutput)}
                      >
                        {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
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
              <div className="flex gap-2 justify-end mt-4">
                <Button onClick={decodeUrl} variant="outline" size="sm">
                  URL Decode
                </Button>
                <Button onClick={encodeUrl} size="sm">
                  URL Encode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regex Tester Content */}
        {activeTool === "regex" && (
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Regex Regular Expression Tester</CardTitle>
                <CardDescription className="text-xs">Create, test, and validate regular expressions instantly</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="gim"
                  value={regexFlags}
                  onChange={(e) => setRegexFlags(e.target.value)}
                  className="w-20 text-center font-mono text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Regex Pattern</FieldLabel>
                  <Button onClick={testRegex} size="sm">
                    <Search className="h-3 w-3 mr-1" /> Find Matches
                  </Button>
                </div>
                <Input
                  placeholder="Pattern…"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Input Text */}
                <div className="flex flex-col gap-2">
                  <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Test Text</FieldLabel>
                  <Textarea
                    placeholder="Enter text strings to search for patterns..."
                    value={regexText}
                    onChange={(e) => setRegexText(e.target.value)}
                    className="min-h-[160px] flex-1 font-mono text-xs"
                  />
                </div>

                {/* Match Outcomes */}
                <div className="flex flex-col gap-2">
                  <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Match results</FieldLabel>
                  <div className="min-h-[160px] flex-1 overflow-y-auto rounded-lg border border-dashed bg-muted/30 p-3 font-mono text-xs leading-relaxed">
                    {regexMatches.length > 0 ? (
                      regexMatches[0].startsWith("[ERROR]") ? (
                        <span className="text-destructive font-semibold">{regexMatches[0]}</span>
                      ) : (
                        <div className="space-y-1">
                          {regexMatches.map((m, idx) => (
                            <div key={idx} className="p-1 bg-primary/10 border border-primary/20 text-primary rounded inline-block mr-1 mb-1">
                              {m}
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <span className="text-muted-foreground text-xs italic">
                        {/* Match outcomes will render here */}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
      </div>
    </div>
  );
}
