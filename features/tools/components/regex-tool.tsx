"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/shared/tool-panel";
import { getErrorMessage } from "@/utils/errors";

export function RegexTool() {
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
            regex.lastIndex++;
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

  return (
    <ToolPanel
      title="Regex Regular Expression Tester"
      description="Create, test, and validate regular expressions instantly"
      headerActions={
        <Input
          placeholder="gim"
          value={regexFlags}
          onChange={(e) => setRegexFlags(e.target.value)}
          className="w-20 text-center font-mono text-xs"
        />
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Regex Pattern
          </FieldLabel>
          <Button onClick={testRegex} size="sm">
            <Search className="mr-1 h-3 w-3" /> Find Matches
          </Button>
        </div>
        <Input
          placeholder="Pattern…"
          value={regexPattern}
          onChange={(e) => setRegexPattern(e.target.value)}
          className="font-mono text-xs"
        />
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Test Text
          </FieldLabel>
          <Textarea
            placeholder="Enter text strings to search for patterns..."
            value={regexText}
            onChange={(e) => setRegexText(e.target.value)}
            className="min-h-[160px] flex-1 font-mono text-xs"
          />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Match results
          </FieldLabel>
          <div className="min-h-[160px] flex-1 overflow-y-auto rounded-lg border border-dashed bg-muted/30 p-3 font-mono text-xs leading-relaxed">
            {regexMatches.length > 0 ? (
              regexMatches[0].startsWith("[ERROR]") ? (
                <span className="font-semibold text-destructive">{regexMatches[0]}</span>
              ) : (
                <div className="space-y-1">
                  {regexMatches.map((m, idx) => (
                    <div
                      key={idx}
                      className="mb-1 mr-1 inline-block rounded border border-primary/20 bg-primary/10 p-1 text-primary"
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <span className="text-xs italic text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </ToolPanel>
  );
}
