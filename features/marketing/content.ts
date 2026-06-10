export const hero = {
  badge: "v1.0 — Advanced Snippets",
  title: "The intelligence layer for your",
  titleHighlight: "codebase",
  description:
    "DevVault centralizes your technical ecosystem. Manage snippets, orchestrate projects, and automate tasks in a high-density environment designed for power users.",
} as const;

export const features = [
  {
    title: "Snippets",
    description:
      "Reusable, version-controlled fragments of logic. Searchable in milliseconds with smart metadata.",
    slug: "snippets",
  },
  {
    title: "Projects",
    description:
      "Context-aware workspaces that bundle tasks, repos, and documentation.",
    slug: "projects",
  },
  {
    title: "Tools",
    description:
      "A curated collection of converters, linters, and formatters directly in your browser.",
    slug: "tools",
  },
  {
    title: "Notes",
    description:
      "Rich-text technical documentation with markdown support.",
    slug: "notes",
  },
  {
    title: "Checklists",
    description:
      "Standardized PR reviews and deployment checklists for flawless releases.",
    slug: "checklists",
  },
] as const;

export const cta = {
  title: "Ready to optimize your workflow?",
  description: "Join developers shipping faster with DevVault.",
  button: "Get Started for Free",
  footnote: "No credit card required.",
} as const;
