import { Bell, LogOut, Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/login/actions";

export async function DashboardHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border-subtle bg-background/80 px-4 backdrop-blur-md md:px-10">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9 pr-16 bg-input/50"
          placeholder="Search snippets, projects..."
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border-subtle bg-accent px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" className="bg-primary hover:bg-primary-container text-primary-foreground font-medium h-9 cursor-pointer">
          <Plus className="h-4 w-4" />
          New Snippet
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
        
        {user && (
          <div className="flex items-center gap-3 ml-2 border-l border-border-subtle pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent border border-border-subtle text-xs font-bold text-primary font-mono cursor-default" title={user.email}>
              {userInitial}
            </div>
            <form action={signOut}>
              <Button variant="ghost" size="icon" type="submit" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
