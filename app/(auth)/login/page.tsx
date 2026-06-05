import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { AuthForm } from "./auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
              DV
            </span>
            DevVault
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
