import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const privatePaths = ['/add-book', '/my-books', '/my-borrows', '/my-profile'];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPrivate =
    privatePaths.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    /^\/books\/[^/]+$/.test(pathname);

  if (!isPrivate) return NextResponse.next();

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/add-book/:path*',
    '/my-books/:path*',
    '/my-borrows/:path*',
    '/my-profile/:path*',
    '/books/:id',
  ],
};