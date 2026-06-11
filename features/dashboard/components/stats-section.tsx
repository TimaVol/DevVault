import Link from "next/link";
import { CheckSquare, Code2, FolderKanban, StickyNote } from "lucide-react";
import { ROUTES } from "@/shared/routes";

type StatItem = {
  label: string;
  value: number;
  icon: React.ElementType;
  href: string;
  iconBg: string;
  iconColor: string;
};

const STAT_ITEMS: Omit<StatItem, "value">[] = [
  {
    label: "Snippets",
    icon: Code2,
    href: ROUTES.snippets,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: ROUTES.projects,
    iconBg: "bg-[#ffb786]/10",
    iconColor: "text-[#ffb786]",
  },
  {
    label: "Checklists",
    icon: CheckSquare,
    href: ROUTES.checklists,
    iconBg: "bg-[#d0bcff]/10",
    iconColor: "text-[#d0bcff]",
  },
  {
    label: "Notes",
    icon: StickyNote,
    href: ROUTES.notes,
    iconBg: "bg-accent-lime/10",
    iconColor: "text-accent-lime",
  },
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
  const values = [snippetsCount, projectsCount, checklistsCount, notesCount];
  const stats = STAT_ITEMS.map((item, i) => ({ ...item, value: values[i] }));

  return (
    <section className="grid grid-cols-1 gap-4 md:h-48 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="tonal-card group flex flex-col justify-between p-6"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded p-2 ${stat.iconBg}`}>
                <Icon className={`size-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div>
              <p className="text-label-caps mb-1 text-muted-foreground">{stat.label}</p>
              <p className="font-display text-4xl font-bold tabular-nums leading-none">
                {stat.value}
              </p>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
