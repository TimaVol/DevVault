import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDemoUser = user?.is_anonymous === true;

  return (
    <DashboardLayout
      userEmail={isDemoUser ? null : (user?.email ?? null)}
      isDemoUser={isDemoUser}
    >
      {children}
    </DashboardLayout>
  );
}
