import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ROUTES } from "@/shared/routes";
import { safeRelativePath } from "@/utils/safe-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRelativePath(searchParams.get("next"), ROUTES.dashboard);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      revalidatePath("/", "layout");
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
  }

  return NextResponse.redirect(`${origin}${ROUTES.login}?error=auth_callback_failed`);
}
