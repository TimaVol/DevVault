import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar userEmail={user?.email ?? null} />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden bg-background">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto p-4 md:p-10">{children}</div>
      </div>
    </div>
  );
}
