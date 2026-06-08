"use client";

import { useState } from "react";
import { Braces, Code, Hash, Key, Link2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Base64Tool } from "./base64-tool";
import { JsonTool } from "./json-tool";
import { JwtTool } from "./jwt-tool";
import { RegexTool } from "./regex-tool";
import { UrlTool } from "./url-tool";

type ActiveTool = "json" | "base64" | "jwt" | "url" | "regex";

const menuItems: { id: ActiveTool; label: string; icon: React.ElementType }[] =
  [
    { id: "json", label: "JSON Formatter", icon: Braces },
    { id: "base64", label: "Base64 Encoder", icon: Hash },
    { id: "jwt", label: "JWT Decoder", icon: Key },
    { id: "url", label: "URL Encoder", icon: Link2 },
    { id: "regex", label: "Regex Tester", icon: Code },
  ];

export function ToolsClient() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("json");

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

        <div className="min-w-0 flex-1">
          {activeTool === "json" && <JsonTool />}
          {activeTool === "base64" && <Base64Tool />}
          {activeTool === "jwt" && <JwtTool />}
          {activeTool === "url" && <UrlTool />}
          {activeTool === "regex" && <RegexTool />}
        </div>
      </div>
    </div>
  );
}
