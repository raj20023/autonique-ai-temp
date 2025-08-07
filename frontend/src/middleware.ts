import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Skip middleware for API routes, static files, and health checks
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/health'
  ) {
    return NextResponse.next();
  }

  // Handle www to non-www redirect
  if (hostname === 'www.autonique.in') {
    const redirectUrl = new URL(`https://autonique.in${pathname}${search}`);
    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
