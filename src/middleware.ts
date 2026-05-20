import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "alterego_auth";

export function middleware(req: NextRequest) {
  // Propagate the request pathname so server components / layouts can decide
  // whether to render their chrome (the admin layout uses this to skip
  // rendering its sidebar on the /admin/login page).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  // /admin/login is the staff sign-in page — must be reachable while logged out.
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    // Send admin-area traffic to the admin sign-in page; founders to the regular one.
    url.pathname = req.nextUrl.pathname.startsWith("/admin") ? "/admin/login" : "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Middleware only confirms a session cookie exists — the real role check
// happens server-side in /admin/layout.tsx and inside each /api/admin/* route
// (via requireAdmin). Edge middleware cannot query Prisma.
export const config = {
  matcher: ["/onboarding/:path*", "/admin/:path*"],
};
