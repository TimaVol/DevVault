import Link from "next/link";
import { CheckSquare, Code2, FolderKanban, StickyNote } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

type StatItem = {
  label: string;
  value: number;
  icon: React.ElementType;
  href: string;
};

const STAT_ITEMS: Omit<StatItem, "value">[] = [
  { label: "Snippets", icon: Code2, href: ROUTES.snippets },
  { label: "Projects", icon: FolderKanban, href: ROUTES.projects },
  { label: "Checklists", icon: CheckSquare, href: ROUTES.checklists },
  { label: "Notes", icon: StickyNote, href: ROUTES.notes },
];

type StatsSectionProps = {
  snippetsCount: number;
  projectsCount: number;
  checklistsCount: number;
  notesCount: number;
};

export function StatsSection({
  snippetsCount,
  projectsCount,
  checklistsCount,
  notesCount,
}: StatsSectionProps) {
  const stats: StatItem[] = [
    { ...STAT_ITEMS[0], value: snippetsCount },
    { ...STAT_ITEMS[1], value: projectsCount },
    { ...STAT_ITEMS[2], value: checklistsCount },
    { ...STAT_ITEMS[3], value: notesCount },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link key={stat.label} href={stat.href} className="group">
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </section>
  );
}
