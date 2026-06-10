"use client";

import { Edit2, ExternalLink, Github, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/features/projects/types";

const statusVariant = (status: string) => {
  if (status === "active") return "status" as const;
  if (status === "completed") return "secondary" as const;
  return "outline" as const;
};

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card size="sm" className="tonal-card flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-base">{project.name}</CardTitle>
          <Badge variant={statusVariant(project.status)} className="capitalize">
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {project.description || "No description"}
        </p>
        {project.techStack && project.techStack.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="justify-between border-t border-border bg-muted/20">
        <div className="flex gap-3">
          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-label-mono text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="size-4" />
              <span className="hidden sm:inline">Repo</span>
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-label-mono text-muted-foreground transition-colors hover:text-primary"
            >
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">Demo</span>
            </a>
          ) : null}
        </div>
        <div className="flex gap-1">
          <Button size="icon-sm" variant="ghost" onClick={() => onEdit(project)}>
            <Edit2 />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={() => onDelete(project.id)}>
            <Trash2 />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
