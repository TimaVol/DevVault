import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthCardShell } from "@/features/auth/components/auth-card-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { ROUTES } from "@/shared/routes";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.forgotPassword);
  }

  return (
    <AuthCardShell backHref={ROUTES.login} backLabel="← Back to sign in">
      <ResetPasswordForm />
    </AuthCardShell>
  );
}
