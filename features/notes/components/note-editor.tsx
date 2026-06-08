"use client";

import { useState } from "react";
import { Edit, Eye, Loader2, Pin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type NoteEditorProps = {
  initialTitle: string;
  initialContent: string;
  initialIsPinned: boolean;
  isLoading: boolean;
  onSave: (data: { title: string; content: string; isPinned: boolean }) => void;
  onDelete: () => void;
};

export function NoteEditor({
  initialTitle,
  initialContent,
  initialIsPinned,
  isLoading,
  onSave,
  onDelete,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPinned, setIsPinned] = useState(initialIsPinned);
  const [isPreview, setIsPreview] = useState(false);

  return (
    <Card className="flex min-w-0 flex-1 flex-col">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsPreview((v) => !v)}>
            {isPreview ? (
              <>
                <Edit data-icon="inline-start" />
                Editor
              </>
            ) : (
              <>
                <Eye data-icon="inline-start" />
                Preview
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant={isPinned ? "secondary" : "outline"}
            onClick={() => setIsPinned((v) => !v)}
          >
            <Pin
              data-icon="inline-start"
              className={isPinned ? "fill-current" : undefined}
            />
            {isPinned ? "Pinned" : "Pin"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onDelete}
            disabled={isLoading}
          >
            <Trash2 />
          </Button>
          <Button onClick={() => onSave({ title, content, isPinned })} disabled={isLoading} size="sm">
            {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-4">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={isPreview}
          className="border-0 px-0 text-lg font-semibold shadow-none focus-visible:ring-0"
        />
        {isPreview ? (
          <div className="min-h-[320px] flex-1 rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {content || (
              <span className="text-muted-foreground italic">Empty note</span>
            )}
          </div>
        ) : (
          <Textarea
            placeholder="Markdown or plain text…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[320px] flex-1 resize-none font-mono text-sm"
          />
        )}
      </CardContent>
    </Card>
  );
}
