"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pin } from "lucide-react";
import { FormDialog } from "@/components/layout/form-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncAction } from "@/hooks/use-async-action";
import { LANGUAGES } from "@/features/snippets/constants";
import { createSnippet, updateSnippet } from "@/features/snippets/server/actions";
import type { Snippet } from "@/features/snippets/types";
import { parseCommaList } from "@/utils/normalize-list";

export function SnippetDialog({
  open,
  onOpenChange,
  snippet,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet?: Snippet | null;
}) {
  const [title, setTitle] = useState(snippet?.title ?? "");
  const [content, setContent] = useState(snippet?.content ?? "");
  const [language, setLanguage] = useState(snippet?.language ?? "javascript");
  const [tagsInput, setTagsInput] = useState(snippet?.tags?.join(", ") ?? "");
  const [isPinned, setIsPinned] = useState(snippet?.isPinned ?? false);
  const { isLoading, run } = useAsyncAction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const tags = parseCommaList(tagsInput);

    await run(
      () =>
        snippet
          ? updateSnippet(snippet.id, {
              title,
              content,
              language,
              tags,
              isPinned,
            })
          : createSnippet({ title, content, language, tags, isPinned }),
      {
        successMessage: snippet ? "Snippet updated" : "Snippet created",
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={snippet ? "Edit snippet" : "New snippet"}
      description="Store reusable code with language and tags."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      contentClassName="max-w-2xl border-border bg-popover backdrop-blur-sm"
    >
      <Field>
        <FieldLabel htmlFor="snippet-title">Title</FieldLabel>
        <Input
          id="snippet-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Language</FieldLabel>
          <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Pinned</FieldLabel>
          <Button
            type="button"
            variant={isPinned ? "default" : "outline"}
            className="w-full"
            onClick={() => setIsPinned(!isPinned)}
          >
            <Pin className={isPinned ? "fill-current" : undefined} />
            {isPinned ? "Pinned" : "Not pinned"}
          </Button>
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="snippet-tags">Tags (comma-separated)</FieldLabel>
        <Input
          id="snippet-tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="snippet-content">Code</FieldLabel>
        <Textarea
          id="snippet-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] font-mono text-xs"
          required
        />
      </Field>
    </FormDialog>
  );
}
