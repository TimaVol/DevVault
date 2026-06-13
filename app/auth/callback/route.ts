import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { resolveAuthCallbackErrorKey } from "@/shared/auth-errors";
import { ROUTES } from "@/shared/routes";
import { safeRelativePath } from "@/utils/safe-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRelativePath(searchParams.get("next"), ROUTES.dashboard);
  const authError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const isPasswordReset = next === ROUTES.resetPassword;

  if (authError) {
    const errorKey = resolveAuthCallbackErrorKey(
      errorCode,
      authError,
      isPasswordReset,
    );
    const destination =
      isPasswordReset ? ROUTES.forgotPassword : ROUTES.login;

    console.error(
      "[auth/callback] auth error:",
      errorCode ?? authError,
      searchParams.get("error_description"),
    );

    return NextResponse.redirect(`${origin}${destination}?error=${errorKey}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      revalidatePath("/", "layout");
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[auth/callback] exchangeCodeForSession failed:", error.message);

    const destination =
      isPasswordReset ? ROUTES.forgotPassword : ROUTES.login;
    const errorKey = isPasswordReset
      ? "reset_link_invalid"
      : "auth_callback_failed";

    return NextResponse.redirect(`${origin}${destination}?error=${errorKey}`);
  }

  return NextResponse.redirect(
    `${origin}${ROUTES.login}?error=auth_callback_failed`,
  );
}
