import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "@/lib/env/public";
import { ROUTES } from "@/shared/routes";

function copyRequestCookies(request: NextRequest, response: NextResponse) {
  request.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });
}

function redirectWithCookies(
  request: NextRequest,
  pathname: string,
): NextResponse {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = pathname;
  const response = NextResponse.redirect(redirectUrl);
  copyRequestCookies(request, response);
  return response;
}

export async function updateSession(request: NextRequest) {
  const supabaseEnv = getSupabasePublicEnv();
  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = pathname.startsWith(ROUTES.dashboard);
  const guestAuthRoutes = [ROUTES.login, ROUTES.signup, ROUTES.forgotPassword] as string[];
  const isGuestAuthRoute = guestAuthRoutes.includes(pathname);
  const isResetPasswordRoute = pathname === ROUTES.resetPassword;

  if (!supabaseEnv) {
    if (process.env.NODE_ENV === "production" && isDashboardRoute) {
      return redirectWithCookies(request, ROUTES.login);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseEnv.url,
    supabaseEnv.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (isDashboardRoute && !user) {
    return redirectWithCookies(request, ROUTES.login);
  }

  if (isResetPasswordRoute && !user) {
    return redirectWithCookies(request, ROUTES.forgotPassword);
  }

  if (isGuestAuthRoute && user) {
    return redirectWithCookies(request, ROUTES.dashboard);
  }

  return supabaseResponse;
}
