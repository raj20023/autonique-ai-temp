import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for health checks and API routes
  if (pathname === '/health' || pathname === '/api/health' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // No redirects for now - let both domains work

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
