import { Bell, Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border-subtle bg-background/80 px-4 backdrop-blur-md md:px-10">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9 pr-16"
          placeholder="Search snippets, projects..."
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border-subtle bg-accent px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm">
          <Plus className="h-4 w-4" />
          New Snippet
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        <div className="ml-1 h-8 w-8 rounded-full border border-border-subtle bg-accent" />
      </div>
    </header>
  );
}
