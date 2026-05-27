import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Snippets",
    description: "Organize and search reusable code with tags and syntax highlighting.",
  },
  {
    title: "Projects",
    description: "Track active work, repos, and context in one developer-first view.",
  },
  {
    title: "Tools",
    description: "Built-in utilities for everyday tasks without leaving your vault.",
  },
  {
    title: "Checklists",
    description: "Ship faster with repeatable launch and review checklists.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1a1a1a,#0a0a0a)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1F1F1F 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-container-low px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              MVP in development
            </span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Your personal{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              developer workspace
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Snippets, projects, tools, and checklists in one fast, focused
            environment — inspired by Linear and Raycast.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/login">
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/dashboard">
                <Terminal className="h-4 w-4" />
                View dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border-subtle px-4 py-20 md:px-10">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-colors hover:border-primary/30">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
