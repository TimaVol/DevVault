import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
};

export function ActiveProjectsCard({ projects }: { projects: Project[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Active projects</CardTitle>
          <CardDescription>Current work in flight</CardDescription>
        </div>
        <Link
          href={ROUTES.projects}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          View all
          <ArrowUpRight data-icon="inline-end" />
        </Link>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <ul className="divide-y">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {project.description || "No description"}
                  </p>
                </div>
                <Badge variant="secondary">{project.status}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <Empty className="border-none p-0">
            <EmptyHeader>
              <EmptyTitle>No projects</EmptyTitle>
              <EmptyDescription>
                Track repos and release context here.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link
                href={ROUTES.projects}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Add project
              </Link>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
