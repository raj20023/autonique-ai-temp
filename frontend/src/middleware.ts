import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for health checks and API routes
  if (pathname === '/health' || pathname === '/api/health' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Force HTTPS redirect
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('host');

  // Only redirect in production and not for localhost
  if (protocol === 'http' && process.env.NODE_ENV === 'production' && host && !host.includes('localhost')) {
    return NextResponse.redirect(`https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`, 301);
  }

  // Optional: Redirect www to non-www (or vice versa)
  if (host === 'www.autonique.in') {
    return NextResponse.redirect(`https://autonique.in${request.nextUrl.pathname}${request.nextUrl.search}`, 301);
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
     * - health (health check endpoints)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|health).*)',
  ],
};
