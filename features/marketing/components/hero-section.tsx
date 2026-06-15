import Link from "next/link";
import { ArrowRight, Bolt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/shared/routes";
import { hero } from "@/features/marketing/content";
import { ViewDemoButton } from "@/features/marketing/components/view-demo-button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center md:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        <Badge
          variant="outline"
          className="gap-2 border-border bg-muted/30 px-3 py-1 text-primary"
        >
          <Bolt className="size-3.5" />
          {hero.badge}
        </Badge>

        <h1 className="text-display-lg font-display leading-tight md:text-5xl">
          {hero.title}{" "}
          <span className="text-primary">{hero.titleHighlight}</span>.
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {hero.description}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
          <Link href={ROUTES.signup} className={cn(buttonVariants({ size: "lg" }))}>
            Get Started
            <ArrowRight data-icon="inline-end" />
          </Link>
          <ViewDemoButton />
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl">
          <div className="absolute -inset-0.5 rounded-xl bg-linear-to-r from-primary/30 to-[#d0bcff]/30 opacity-20 blur" />
          <div className="tonal-card relative overflow-hidden rounded-xl">
            <div className="aspect-video bg-linear-to-br from-muted/40 via-background to-muted/20 p-8">
              <div className="grid h-full grid-cols-12 gap-3">
                <div className="col-span-3 rounded-md border border-border bg-card/80" />
                <div className="col-span-9 space-y-3">
                  <div className="h-8 rounded-md border border-border bg-card/80" />
                  <div className="grid flex-1 grid-cols-2 gap-3">
                    <div className="rounded-md border border-border bg-card/80" />
                    <div className="rounded-md border border-border bg-card/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
