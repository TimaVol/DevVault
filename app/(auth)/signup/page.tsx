import { redirect } from "next/navigation";
import { AuthCardShell } from "@/features/auth/components/auth-card-shell";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { env } from "@/lib/env";
import { ROUTES } from "@/shared/routes";

export default function SignUpPage() {
  if (env.DISABLE_SIGNUP) {
    redirect(ROUTES.login);
  }

  return (
    <AuthCardShell backHref={ROUTES.home} backLabel="← Back to home">
      <SignUpForm />
    </AuthCardShell>
  );
}
