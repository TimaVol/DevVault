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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Tool Switcher */}
      <aside className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-1 border border-border-subtle bg-surface-card rounded-lg p-2 overflow-x-auto md:overflow-x-visible">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTool === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Main workspace */}
      <div className="flex-1 min-w-0">
        
        {/* JSON Tool Content */}
        {activeTool === "json" && (
          <Card className="border-border-subtle bg-surface-card h-full flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-display text-lg font-bold">JSON Formatter & Validator</CardTitle>
                <CardDescription className="text-xs">Format, minify, and validate JSON payloads instantly</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={jsonIndent}
                  onChange={(e) => setJsonIndent(Number(e.target.value))}
                  className="rounded-md border border-border-subtle bg-input px-2 py-1 text-xs font-medium text-foreground cursor-pointer"
                >
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input Payload</label>
                  <textarea
                    placeholder='{ "key": "value" }'
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-input/50 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none min-h-[220px]"
                  />
                </div>
                {/* Output */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Formatted Output</label>
                    {jsonOutput && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(jsonOutput)}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {copied ? <Check className="h-3 w-3 text-accent-lime" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                  <textarea
                    readOnly
                    placeholder="// Output will appear here"
                    value={jsonOutput}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-background/50 focus:outline-none leading-relaxed resize-none min-h-[220px]"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button onClick={minifyJson} variant="outline" className="border-border-subtle cursor-pointer h-9 text-xs">
                  Minify JSON
                </Button>
                <Button onClick={formatJson} className="bg-primary hover:bg-primary-container text-primary-foreground cursor-pointer h-9 text-xs">
                  Format JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Base64 Content */}
        {activeTool === "base64" && (
          <Card className="border-border-subtle bg-surface-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-display text-lg font-bold">Base64 Encoder / Decoder</CardTitle>
              <CardDescription className="text-xs">Convert raw text strings to and from Base64 hash standards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input String</label>
                  <textarea
                    placeholder="Enter plain text or Base64 string..."
                    value={b64Input}
                    onChange={(e) => setB64Input(e.target.value)}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-input/50 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none min-h-[220px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Base64 Output</label>
                    {b64Output && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(b64Output)}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {copied ? <Check className="h-3 w-3 text-accent-lime" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                  <textarea
                    readOnly
                    placeholder="// Result will appear here"
                    value={b64Output}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-background/50 focus:outline-none leading-relaxed resize-none min-h-[220px]"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button onClick={decodeBase64} variant="outline" className="border-border-subtle cursor-pointer h-9 text-xs">
                  Base64 Decode
                </Button>
                <Button onClick={encodeBase64} className="bg-primary hover:bg-primary-container text-primary-foreground cursor-pointer h-9 text-xs">
                  Base64 Encode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* JWT Decoder Content */}
        {activeTool === "jwt" && (
          <Card className="border-border-subtle bg-surface-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-display text-lg font-bold">JWT Token Decoder</CardTitle>
              <CardDescription className="text-xs">Inspect JWT token headers, payload claims, and expiration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Encoded JWT Token</label>
                  <Button onClick={decodeJwt} size="sm" className="bg-primary hover:bg-primary-container text-primary-foreground cursor-pointer h-8 text-xs">
                    <RefreshCw className="h-3 w-3 mr-1" /> Decode Token
                  </Button>
                </div>
                <textarea
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-input/50 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none h-20 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-primary">JWT Header</label>
                    {jwtHeader && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(jwtHeader)}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {copied ? <Check className="h-3 w-3 text-accent-lime" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                  <textarea
                    readOnly
                    placeholder="// Encoded JWT header segment"
                    value={jwtHeader}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-background/50 focus:outline-none leading-relaxed resize-none min-h-[160px]"
                  />
                </div>

                {/* Payload */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-secondary">JWT Payload</label>
                    {jwtPayload && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(jwtPayload)}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {copied ? <Check className="h-3 w-3 text-accent-lime" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                  <textarea
                    readOnly
                    placeholder="// Decoded JWT payload payload claims"
                    value={jwtPayload}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-background/50 focus:outline-none leading-relaxed resize-none min-h-[160px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* URL Content */}
        {activeTool === "url" && (
          <Card className="border-border-subtle bg-surface-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-display text-lg font-bold">URL Encoder / Decoder</CardTitle>
              <CardDescription className="text-xs">Convert raw text string formatting safely to and from RFC web parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input String</label>
                  <textarea
                    placeholder="Enter URL queries or parameter string..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-input/50 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none min-h-[220px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL Output</label>
                    {urlOutput && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(urlOutput)}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {copied ? <Check className="h-3 w-3 text-accent-lime" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                  <textarea
                    readOnly
                    placeholder="// Result will appear here"
                    value={urlOutput}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-background/50 focus:outline-none leading-relaxed resize-none min-h-[220px]"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button onClick={decodeUrl} variant="outline" className="border-border-subtle cursor-pointer h-9 text-xs">
                  URL Decode
                </Button>
                <Button onClick={encodeUrl} className="bg-primary hover:bg-primary-container text-primary-foreground cursor-pointer h-9 text-xs">
                  URL Encode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regex Tester Content */}
        {activeTool === "regex" && (
          <Card className="border-border-subtle bg-surface-card h-full flex flex-col">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-display text-lg font-bold">Regex Regular Expression Tester</CardTitle>
                <CardDescription className="text-xs">Create, test, and validate regular expressions instantly</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="flags e.g. g, i, m"
                  value={regexFlags}
                  onChange={(e) => setRegexFlags(e.target.value)}
                  className="rounded-md border border-border-subtle bg-input/50 px-2 py-1 text-xs w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-[480px]">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Regex Pattern</label>
                  <Button onClick={testRegex} size="sm" className="bg-primary hover:bg-primary-container text-primary-foreground cursor-pointer h-8 text-xs">
                    <Search className="h-3 w-3 mr-1" /> Find Matches
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className="w-full px-3 h-10 font-mono text-xs rounded-md border border-border-subtle bg-input/50 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Input Text */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Test Text</label>
                  <textarea
                    placeholder="Enter text strings to search for patterns..."
                    value={regexText}
                    onChange={(e) => setRegexText(e.target.value)}
                    className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-input/50 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none min-h-[160px]"
                  />
                </div>

                {/* Match Outcomes */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Match results</label>
                  <div className="flex-1 w-full p-3 font-mono text-xs rounded-md border border-border-subtle bg-background/50 h-[160px] overflow-y-auto leading-relaxed border-dashed">
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
  );
}
