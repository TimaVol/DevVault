import { AuthCardShell } from "@/features/auth/components/auth-card-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { ROUTES } from "@/shared/routes";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthCardShell backHref={ROUTES.login} backLabel="← Back to sign in">
      <ForgotPasswordForm callbackError={error} />
    </AuthCardShell>
  );
}
