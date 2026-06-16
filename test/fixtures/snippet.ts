import type { Snippet } from "@/features/snippets/types";

const now = new Date("2024-06-15T12:00:00Z");

export function makeSnippet(overrides: Partial<Snippet> = {}): Snippet {
  return {
    id: "snippet-1",
    userId: "user-1",
    title: "Hello World",
    content: "console.log('hello')",
    language: "javascript",
    isPinned: false,
    tags: ["react", "typescript", "nextjs", "vitest"],
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
