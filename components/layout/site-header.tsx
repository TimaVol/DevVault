import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/shared/routes";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: ROUTES.login, label: "Sign in" },
] as const;

export function SiteHeader() {
  return (
    <header className="glass-header sticky top-0 z-40 h-16">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-10">
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2 font-display font-semibold"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            DV
          </span>
          DevVault
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.login}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Log in
          </Link>
          <Link href={ROUTES.login} className={cn(buttonVariants({ size: "sm" }))}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
