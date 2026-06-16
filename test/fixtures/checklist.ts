import type { Checklist } from "@/features/checklists/types";

const now = new Date("2024-06-15T12:00:00Z");

export function makeChecklistItem(
  overrides: Partial<Checklist["items"][number]> = {},
): Checklist["items"][number] {
  return {
    id: "item-1",
    checklistId: "checklist-1",
    content: "Task one",
    isCompleted: false,
    position: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeChecklist(overrides: Partial<Checklist> = {}): Checklist {
  return {
    id: "checklist-1",
    userId: "user-1",
    title: "My Checklist",
    description: "A test checklist",
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    items: [
      makeChecklistItem(),
      makeChecklistItem({
        id: "item-2",
        content: "Task two",
        isCompleted: true,
        position: 1,
      }),
    ],
    ...overrides,
  };
}
