"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CardEditDeleteActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function CardEditDeleteActions({ onEdit, onDelete }: CardEditDeleteActionsProps) {
  return (
    <div className="flex gap-1">
      <Button size="icon-sm" variant="ghost" onClick={onEdit}>
        <Edit2 />
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={onDelete}>
        <Trash2 />
      </Button>
    </div>
  );
}
