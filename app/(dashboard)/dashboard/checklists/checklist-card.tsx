"use client";

import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

type ChecklistItem = {
  id: string;
  content: string;
  isCompleted: boolean;
};

type Checklist = {
  id: string;
  title: string;
  description: string | null;
  items: ChecklistItem[];
};

type ChecklistCardProps = {
  checklist: Checklist;
  onToggle: (itemId: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
};

export function ChecklistCard({ checklist, onToggle, onDelete }: ChecklistCardProps) {
  const done = checklist.items.filter((i) => i.isCompleted).length;
  const total = checklist.items.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle>{checklist.title}</CardTitle>
          {checklist.description ? (
            <p className="text-sm text-muted-foreground">{checklist.description}</p>
          ) : null}
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onDelete(checklist.id)}
        >
          <Trash2 />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {done}/{total} done
            </span>
            <Badge variant="secondary">{pct}%</Badge>
          </div>
          <Progress value={pct} />
        </div>
        <ul className="space-y-2">
          {checklist.items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm">
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
