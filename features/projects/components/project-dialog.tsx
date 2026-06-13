"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FormDialog } from "@/components/shared/form-dialog";
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
import { useEntityFormSubmit } from "@/hooks/use-entity-form-submit";
import { PROJECT_STATUSES } from "@/features/projects/constants";
import { createProject, updateProject } from "@/features/projects/server/actions";
import type { Project } from "@/features/projects/types";
import { parseCommaList } from "@/utils/normalize-list";

type ProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: Project | null;
};

export function ProjectDialog({ open, onOpenChange, entity }: ProjectDialogProps) {
  const [name, setName] = useState(entity?.name ?? "");
  const [description, setDescription] = useState(entity?.description ?? "");
  const [repoUrl, setRepoUrl] = useState(entity?.repositoryUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(entity?.demoUrl ?? "");
  const [status, setStatus] = useState(entity?.status ?? "active");
  const [techStackInput, setTechStackInput] = useState(entity?.techStack?.join(", ") ?? "");

  const reset = () => {
    setName("");
    setDescription("");
    setRepoUrl("");
    setDemoUrl("");
    setStatus("active");
    setTechStackInput("");
  };

  const { isLoading, submit } = useEntityFormSubmit({
    isEditing: !!entity,
    onOpenChange,
    reset,
    createMessage: "Project created",
    updateMessage: "Project updated",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    const payload = {
      name,
      description: description || undefined,
      repositoryUrl: repoUrl || undefined,
      demoUrl: demoUrl || undefined,
      status,
      techStack: parseCommaList(techStackInput),
    };

    await submit(() =>
      entity ? updateProject(entity.id, payload) : createProject(payload),
    );
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={entity ? "Edit project" : "New project"}
      description="Track scope, links, and stack."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onBeforeClose={reset}
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
