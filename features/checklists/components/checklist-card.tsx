"use client";

import { CardEditDeleteActions } from "@/components/shared/card-edit-delete-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import type { Checklist } from "@/features/checklists/types";

type ChecklistCardProps = {
  checklist: Checklist;
  onToggle: (itemId: string, isCompleted: boolean) => void;
  onEdit: (checklist: Checklist) => void;
  onDelete: (id: string) => void;
};

export function ChecklistCard({ checklist, onToggle, onEdit, onDelete }: ChecklistCardProps) {
  const done = checklist.items.filter((i) => i.isCompleted).length;
  const total = checklist.items.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card className="tonal-card">
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b border-border pb-4">
        <div>
          <CardTitle className="text-headline-md">{checklist.title}</CardTitle>
          {checklist.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{checklist.description}</p>
          ) : null}
        </div>
        <CardEditDeleteActions
          onEdit={() => onEdit(checklist)}
          onDelete={() => onDelete(checklist.id)}
        />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-label-mono text-muted-foreground">
            <span>
              {done}/{total} complete
            </span>
            <Badge variant={pct === 100 ? "status" : "outline"}>{pct}%</Badge>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
        <ul className="space-y-2">
          {checklist.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-md border border-transparent px-2 py-1.5 text-sm transition-colors hover:border-border hover:bg-muted/30"
            >
              <Checkbox
                checked={item.isCompleted}
                onCheckedChange={() => onToggle(item.id, item.isCompleted)}
              />
              <span
                className={
                  item.isCompleted ? "text-muted-foreground line-through" : undefined
                }
              >
                {item.content}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
