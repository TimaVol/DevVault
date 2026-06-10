import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { AuthForm } from "@/features/auth/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell>
      <Card className="tonal-card border-border shadow-none">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-10 items-center justify-center rounded-md border border-border bg-card text-sm font-bold text-primary">
              DV
            </span>
            <div>
              <p className="font-display text-lg font-semibold">DevVault</p>
              <p className="text-label-mono text-muted-foreground uppercase">
                Developer Workspace
              </p>
            </div>
          </div>
        </CardHeader>
        <AuthForm callbackError={error} />
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href={ROUTES.home} className="hover:text-foreground">
          ← Back to home
        </Link>
      </p>
    </AuthShell>
  );
}
