import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

// Next.js 16 "proxy" convention (formerly "middleware").
const handleIntl = createIntlMiddleware(routing);

const ADMIN_RE = /^\/(en|bn)\/admin(?:\/(.*))?$/;

export default async function proxy(request: NextRequest) {
  const response = handleIntl(request);

  const match = request.nextUrl.pathname.match(ADMIN_RE);
  if (!match) return response;

  const locale = match[1];
  const isLoginPage = !match[2]; // exactly /{locale}/admin

  // Refresh the Supabase session and read the user (cookies written onto the
  // intl response so tokens stay in sync).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          ),
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isLoginPage) {
    // Already-authenticated admins skip the login page.
    if (user) {
      const { data } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/admin/dashboard`;
        const redirect = NextResponse.redirect(url);
        response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
        return redirect;
      }
    }
    return response;
  }

  // Protected admin route: require session AND admins membership.
  let allowed = false;
  if (user) {
    const { data } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    allowed = !!data;
  }

  if (!allowed) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin`;
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
