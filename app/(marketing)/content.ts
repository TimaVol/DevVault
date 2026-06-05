export const hero = {
  badge: "MVP in development",
  title: "Your personal",
  titleHighlight: "developer workspace",
  description:
    "Snippets, projects, tools, and checklists in one fast, focused environment.",
} as const;

export const features = [
  {
    title: "Snippets",
    description:
      "Organize and search reusable code with tags and syntax highlighting.",
  },
  {
    title: "Projects",
    description:
      "Track active work, repos, and context in one developer-first view.",
  },
  {
    title: "Tools",
    description:
      "Built-in utilities for everyday tasks without leaving your vault.",
  },
  {
    title: "Checklists",
    description: "Ship faster with repeatable launch and review checklists.",
  },
] as const;
