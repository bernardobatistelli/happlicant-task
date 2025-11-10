import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Always redirect to /home
  if (request.nextUrl.pathname !== "/home") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  // Run on all routes except static files, API routes, and Next.js internals
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
