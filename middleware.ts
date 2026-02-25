import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect admin routes
 *
 * - /admin/login: Always accessible
 * - /admin/*: Requires authentication
 * - /api/admin/*: Requires authentication
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Allow access to login page
  if (pathname === '/admin/login') {
    // Redirect to admin dashboard if already logged in
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!isLoggedIn) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
