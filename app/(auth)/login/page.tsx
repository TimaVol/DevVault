import { AuthCardShell } from "@/features/auth/components/auth-card-shell";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthCardShell>
      <SignInForm callbackError={error} />
    </AuthCardShell>
  );
}
