"use client";

import { AppSideNav } from "@/components/layout/app-sidebar";
import { AppTopNav } from "@/components/layout/app-top-nav";
import { AppShellProvider } from "@/components/providers/app-shell-provider";
import { ConfirmDeleteProvider } from "@/components/providers/confirm-delete-provider";

export function DashboardLayout({
  userEmail,
  isDemoUser = false,
  children,
}: {
  userEmail: string | null;
  isDemoUser?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ConfirmDeleteProvider>
      <AppShellProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <AppSideNav userEmail={userEmail} isDemoUser={isDemoUser} />
          <div className="flex min-w-0 flex-1 flex-col md:ml-60">
            <AppTopNav userEmail={userEmail} isDemoUser={isDemoUser} />
            <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </AppShellProvider>
    </ConfirmDeleteProvider>
  );
}
