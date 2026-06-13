import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { ROUTES } from "@/shared/routes";

type AuthCardShellProps = {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AuthCardShell({
  children,
  backHref = ROUTES.home,
  backLabel = "← Back to home",
}: AuthCardShellProps) {
  return (
    <>
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
        {children}
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href={backHref} className="hover:text-foreground">
          {backLabel}
        </Link>
      </p>
    </>
  );
}
