"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Code,
  Edit2,
  ExternalLink,
  FolderKanban,
  Github,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createProject, deleteProject, updateProject } from "./actions";

interface ProjectsClientProps {
  initialProjects: any[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [status, setStatus] = useState("active");
  const [techStackInput, setTechStackInput] = useState("");

  const handleCreate = () => {
    setEditingProject(null);
    setName("");
    setDescription("");
    setRepoUrl("");
    setDemoUrl("");
    setStatus("active");
    setTechStackInput("");
    setIsDialogOpen(true);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setName(project.name || "");
    setDescription(project.description || "");
    setRepoUrl(project.repositoryUrl || "");
    setDemoUrl(project.demoUrl || "");
    setStatus(project.status || "active");
    setTechStackInput(project.techStack ? project.techStack.join(", ") : "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await deleteProject(id);
        if (res.success) {
          toast.success("Project deleted successfully!");
        } else {
          toast.error(res.error || "Failed to delete project");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    const techStackArray = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsLoading(true);

    try {
      if (editingProject) {
        // Edit mode
        const res = await updateProject(editingProject.id, {
          name,
          description: description || undefined,
          repositoryUrl: repoUrl || undefined,
          demoUrl: demoUrl || undefined,
          status,
          techStack: techStackArray,
        });

        if (res.success) {
          toast.success("Project updated successfully!");
          setIsDialogOpen(false);
        } else {
          toast.error(res.error || "Failed to update project");
        }
      } else {
        // Create mode
        const res = await createProject({
          name,
          description,
          repositoryUrl: repoUrl,
          demoUrl: demoUrl,
          status,
          techStack: techStackArray,
        });

        if (res.success) {
          toast.success("Project created successfully!");
          setIsDialogOpen(false);
        } else {
          toast.error(res.error || "Failed to create project");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter projects by search and status
  const filteredProjects = initialProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.techStack &&
        project.techStack.some((tech: string) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesTab = activeTab === "all" || project.status === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Project Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track active development, manage your repositories, and follow roadmap goals.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="sm"
          className="bg-primary hover:bg-primary-container text-primary-foreground font-semibold flex items-center gap-1.5 cursor-pointer self-start md:self-auto h-9"
        >
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </section>

      {/* Tabs & Search controls */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex bg-surface-container-low border border-border-subtle rounded-md p-1 shrink-0">
          {["all", "backlog", "active", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-accent border border-border-subtle text-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-input/50 border-border-subtle text-sm h-10"
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card
              key={project.id}
              className={`relative overflow-hidden transition-all duration-200 border-border-subtle bg-surface-card hover:border-primary/20 ${
                project.status === "active"
                  ? "ring-1 ring-primary/10 border-primary/20"
                  : project.status === "completed"
                  ? "border-accent-lime/30"
                  : ""
              }`}
            >
              <CardContent className="p-5 flex flex-col justify-between h-56">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground truncate">{project.name}</h3>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-medium border uppercase tracking-wider ${
                        project.status === "completed"
                          ? "bg-accent-lime/10 text-accent-lime border-accent-lime/20"
                          : project.status === "active"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed h-16 max-h-16 overflow-y-auto">
                    {project.description || "No project description provided. Add one to describe scope."}
                  </p>

                  {/* Tech stack badges */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech: string) => (
                        <span
                          key={tech}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent border border-border-subtle text-muted-foreground uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-4 shrink-0">
                  <div className="flex gap-2">
                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(project)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(project.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-16 text-sm text-muted-foreground border border-dashed border-border-subtle rounded-md">
            <FolderKanban className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium text-foreground">No projects found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add folders, check progress, and trace active work scopes here.
            </p>
            <Button onClick={handleCreate} variant="outline" size="sm" className="mt-4 cursor-pointer">
              Track a new project
            </Button>
          </div>
        )}
      </section>

      {/* Project Editor Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-lg border border-border-subtle bg-surface-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  {editingProject ? "Edit Project Details" : "Track New Project"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Organize and track active work scopes
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-sm cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Project Name <span className="text-primary">*</span>
                </label>
                <Input
                  placeholder="e.g. Portfolio Website"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-input/50 border-border-subtle text-sm h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Summarize the core scope of this project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 rounded-md border border-border-subtle bg-input/50 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Repository URL
                  </label>
                  <Input
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="bg-input/50 border-border-subtle text-xs h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Live Demo URL
                  </label>
                  <Input
                    placeholder="https://..."
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="bg-input/50 border-border-subtle text-xs h-10"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Development Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-border-subtle bg-input/50 px-3 h-10 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tech Stack (Comma-separated)
                  </label>
                  <Input
                    placeholder="Next.js, Tailwind, Supabase"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="bg-input/50 border-border-subtle text-xs h-10"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-border-subtle pt-4 mt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-container text-primary-foreground font-semibold cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : editingProject ? (
                    "Save Changes"
                  ) : (
                    "Add Project"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
