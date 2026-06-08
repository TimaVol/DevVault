import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/lib/routes";
import { hero } from "@/features/marketing/content";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--muted),var(--background))]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="mb-6 gap-2 px-3 py-1">
          <span
            className="size-2 animate-pulse rounded-full bg-primary"
            aria-hidden
          />
          {hero.badge}
        </Badge>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {hero.title}{" "}
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            {hero.titleHighlight}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {hero.description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={ROUTES.login} className={cn(buttonVariants({ size: "lg" }))}>
            Get started
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </section>
  );
}
