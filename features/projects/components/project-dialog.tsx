"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FormDialog } from "@/components/layout/form-dialog";
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
import { PROJECT_STATUSES } from "@/features/projects/constants";
import { createProject, updateProject } from "@/features/projects/server/actions";
import type { Project } from "@/features/projects/types";
import { parseCommaList } from "@/utils/normalize-list";

type ProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Project | null;
};

export function ProjectDialog({ open, onOpenChange, editing }: ProjectDialogProps) {
  const { isLoading, run } = useAsyncAction();
  const [name, setName] = useState(editing?.name ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [repoUrl, setRepoUrl] = useState(editing?.repositoryUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(editing?.demoUrl ?? "");
  const [status, setStatus] = useState(editing?.status ?? "active");
  const [techStackInput, setTechStackInput] = useState(editing?.techStack?.join(", ") ?? "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    const techStack = parseCommaList(techStackInput);

    const payload = {
      name,
      description: description || undefined,
      repositoryUrl: repoUrl || undefined,
      demoUrl: demoUrl || undefined,
      status,
      techStack,
    };

    await run(
      () =>
        editing
          ? updateProject(editing.id, payload)
          : createProject(payload),
      {
        successMessage: editing ? "Project updated" : "Project created",
        errorMessage: "Save failed",
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit project" : "New project"}
      description="Track scope, links, and stack."
      onSubmit={submit}
      isLoading={isLoading}
    >
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field>
        <FieldLabel htmlFor="desc">Description</FieldLabel>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="repo">Repository URL</FieldLabel>
          <Input id="repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="demo">Demo URL</FieldLabel>
          <Input id="demo" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="stack">Tech stack</FieldLabel>
          <Input
            id="stack"
            placeholder="Next.js, Supabase"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
          />
        </Field>
      </div>
    </FormDialog>
  );
}
