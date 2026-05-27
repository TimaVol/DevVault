import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Snippets", value: "24" },
  { label: "Active projects", value: "6" },
  { label: "Open checklists", value: "3" },
  { label: "Notes", value: "12" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Good evening
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s what&apos;s happening across your workspace today.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent snippets</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Snippet list will load from Supabase + Drizzle once auth and schema
            are connected.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active projects</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Project cards and status tracking will appear here in the next
            milestone.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
