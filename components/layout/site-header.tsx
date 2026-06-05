import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href={ROUTES.home} className="flex items-center gap-2 font-display font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            DV
          </span>
          DevVault
        </Link>
        <div className="flex items-center gap-2">
          <Link href={ROUTES.login} className={cn(buttonVariants({ size: "sm" }))}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
