import {
  CheckSquare,
  Code2,
  FolderKanban,
  StickyNote,
  Wrench,
} from 'lucide-react'
import { features, cta } from '@/features/marketing/content'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/shared/routes'

export function FeaturesSection() {
  const snippets = features.find((f) => f.slug === 'snippets')!
  const projects = features.find((f) => f.slug === 'projects')!
  const tools = features.find((f) => f.slug === 'tools')!
  const notes = features.find((f) => f.slug === 'notes')!
  const checklists = features.find((f) => f.slug === 'checklists')!

  return (
    <>
      <section
        id="features"
        className="border-t border-border bg-muted/10 px-4 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 space-y-2">
            <h2 className="text-headline-lg font-display">
              Integrated Workspace
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Every tool you need to maintain speed without sacrificing
              precision.
            </p>
          </div>

          <div className="grid h-auto grid-cols-1 gap-4 md:h-[600px] md:grid-cols-12">
            <div className="tonal-card flex flex-col justify-between p-6 md:col-span-8">
              <div className="space-y-2">
                <Code2 className="size-5 text-primary" />
                <h3 className="text-headline-md font-display">
                  {snippets.title}
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {snippets.description}
                </p>
              </div>
              <div className="mt-6 overflow-hidden rounded-md border border-border bg-muted/20 p-4 font-mono text-xs text-muted-foreground">
                <pre>
                  {`export function vault<T>(data: T): Storage {
                    return new SecureVault(data, {
                      encryption: 'AES-256',
                      mode: 'Developer'
                    });
                  }`}
                </pre>
              </div>
            </div>

            <div className="tonal-card relative flex flex-col justify-end gap-4 overflow-hidden p-6 md:col-span-4">
              <FolderKanban className="absolute top-4 right-4 size-24 text-primary/10" />
              <div>
                <FolderKanban className="mb-2 size-5 text-primary" />
                <h3 className="text-headline-md font-display">
                  {projects.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {projects.description}
                </p>
              </div>
            </div>

            <div className="tonal-card space-y-2 p-6 transition-colors hover:bg-muted/20 md:col-span-4">
              <Wrench className="size-5 text-primary" />
              <h3 className="text-headline-md font-display">{tools.title}</h3>
              <p className="text-sm text-muted-foreground">
                {tools.description}
              </p>
            </div>

            <div className="tonal-card space-y-2 p-6 transition-colors hover:bg-muted/20 md:col-span-4">
              <StickyNote className="size-5 text-primary" />
              <h3 className="text-headline-md font-display">{notes.title}</h3>
              <p className="text-sm text-muted-foreground">
                {notes.description}
              </p>
            </div>

            <div className="tonal-card space-y-2 p-6 transition-colors hover:bg-muted/20 md:col-span-4">
              <CheckSquare className="size-5 text-primary" />
              <h3 className="text-headline-md font-display">
                {checklists.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {checklists.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border px-4 py-20 md:px-10">
        <div className="tonal-card mx-auto flex max-w-4xl flex-col items-center gap-8 overflow-hidden p-10 md:flex-row">
          <div className="flex-1 space-y-3">
            <h2 className="text-headline-lg font-display">{cta.title}</h2>
            <p className="text-muted-foreground">{cta.description}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href={ROUTES.signup}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              {cta.button}
            </Link>
            <p className="text-center text-sm text-muted-foreground">
              {cta.footnote}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
