"use client";

import { useState } from "react";
import { Braces, Code, Hash, Key, Link2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Base64Tool } from "./base64-tool";
import { JsonTool } from "./json-tool";
import { JwtTool } from "./jwt-tool";
import { RegexTool } from "./regex-tool";
import { UrlTool } from "./url-tool";

type ActiveTool = "json" | "base64" | "jwt" | "url" | "regex";

const menuItems: { id: ActiveTool; label: string; icon: React.ElementType }[] = [
  { id: "json", label: "JSON Formatter", icon: Braces },
  { id: "base64", label: "Base64 Encoder", icon: Hash },
  { id: "jwt", label: "JWT Decoder", icon: Key },
  { id: "url", label: "URL Encoder", icon: Link2 },
  { id: "regex", label: "Regex Tester", icon: Code },
];

export function ToolsClient() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("json");

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
      <aside className="w-full shrink-0 border-border lg:w-56 lg:border-r lg:pr-4">
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTool === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTool(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors lg:w-full",
                  isActive
                    ? "border-l-2 border-primary bg-muted/40 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 lg:pl-6">
        {activeTool === "json" && <JsonTool />}
        {activeTool === "base64" && <Base64Tool />}
        {activeTool === "jwt" && <JwtTool />}
        {activeTool === "url" && <UrlTool />}
        {activeTool === "regex" && <RegexTool />}
      </div>
    </div>
  );
}
