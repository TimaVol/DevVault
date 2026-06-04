"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Edit2,
  ExternalLink,
  FolderKanban,
  Github,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getErrorMessage } from "@/utils/errors";
import { createProject, deleteProject, updateProject } from "./actions";

type Project = {
  id: string;
  name: string;
  description: string | null;
  repositoryUrl: string | null;
  demoUrl: string | null;
  status: string;
  techStack: string[] | null;
};

export function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [status, setStatus] = useState("active");
  const [techStackInput, setTechStackInput] = useState("");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setRepoUrl("");
    setDemoUrl("");
    setStatus("active");
    setTechStackInput("");
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setName(p.name);
    setDescription(p.description ?? "");
    setRepoUrl(p.repositoryUrl ?? "");
    setDemoUrl(p.demoUrl ?? "");
    setStatus(p.status);
    setTechStackInput(p.techStack?.join(", ") ?? "");
    setOpen(true);
  };

  const filtered = initialProjects.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q) ?? false) ||
      (p.techStack?.some((t) => t.toLowerCase().includes(q)) ?? false);
    const matchesTab = tab === "all" || p.status === tab;
    return matchesSearch && matchesTab;
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const payload = {
        name,
        description: description || undefined,
        repositoryUrl: repoUrl || undefined,
        demoUrl: demoUrl || undefined,
        status,
        techStack,
      };
      const res = editing
        ? await updateProject(editing.id, payload)
        : await createProject(payload);

      if (res.success) {
        toast.success(editing ? "Project updated" : "Project created");
        setOpen(false);
      } else {
        toast.error(res.error || "Save failed");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await deleteProject(id);
      if (res.success) toast.success("Project deleted");
      else toast.error(res.error || "Delete failed");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Projects"
        description="Track repos, demos, and delivery status."
        actions={
          <Button onClick={openCreate}>
            <Plus data-icon="inline-start" />
            Add project
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            {["all", "backlog", "active", "completed"].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderKanban />
            </EmptyMedia>
            <EmptyTitle>No projects</EmptyTitle>
            <EmptyDescription>Create a project to track your work.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={openCreate}>
              Add project
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <Card key={project.id} size="sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {project.description || "No description"}
                </p>
                {project.techStack && project.techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="justify-between">
                <div className="flex gap-2">
                  {project.repositoryUrl ? (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Github className="size-4" />
                    </a>
                  ) : null}
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  ) : null}
                </div>
                <div className="flex gap-1">
                  <Button size="icon-sm" variant="ghost" onClick={() => openEdit(project)}>
                    <Edit2 />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => remove(project.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
            <DialogDescription>Track scope, links, and stack.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit}>
            <FieldGroup className="py-2">
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
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
