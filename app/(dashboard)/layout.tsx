import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden bg-background">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto p-4 md:p-10">{children}</div>
      </div>
    </div>
  );
}
