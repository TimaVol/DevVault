"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Pin } from "lucide-react";
import { createSnippet, updateSnippet } from "@/app/(dashboard)/dashboard/snippets/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/utils/errors";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Bash" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "plaintext", label: "Plaintext" },
] as const;

type Snippet = {
  id: string;
  title?: string;
  content?: string;
  language?: string;
  tags?: string[] | null;
  isPinned?: boolean;
};

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setIsLoading(true);
    try {
      const res = snippet
        ? await updateSnippet(snippet.id, {
            title,
            content,
            language,
            tags,
            isPinned,
          })
        : await createSnippet({ title, content, language, tags, isPinned });

      if (res.success) {
        toast.success(snippet ? "Snippet updated" : "Snippet created");
        onOpenChange(false);
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{snippet ? "Edit snippet" : "New snippet"}</DialogTitle>
          <DialogDescription>
            Store reusable code with language and tags.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-2">
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
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
