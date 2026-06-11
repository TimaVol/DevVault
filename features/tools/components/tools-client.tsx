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

const TOOLS: {
  id: ActiveTool;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
}[] = [
  { id: "json", label: "JSON Formatter", icon: Braces, component: JsonTool },
  { id: "base64", label: "Base64 Encoder", icon: Hash, component: Base64Tool },
  { id: "jwt", label: "JWT Decoder", icon: Key, component: JwtTool },
  { id: "url", label: "URL Encoder", icon: Link2, component: UrlTool },
  { id: "regex", label: "Regex Tester", icon: Code, component: RegexTool },
];

export function ToolsClient() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("json");
  const ActiveComponent = TOOLS.find((tool) => tool.id === activeTool)?.component ?? JsonTool;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
      <aside className="w-full shrink-0 border-border lg:w-56 lg:border-r lg:pr-4">
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {TOOLS.map((item) => {
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
        <ActiveComponent />
      </div>
    </div>
  );
}
