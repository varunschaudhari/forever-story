import { NextResponse, NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/error'];

/**
 * Handle route protection
 */
export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = req.cookies.get('authjs.session-token')?.value;

  const isLoggedIn = !!token;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // Redirect to signin if accessing protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${nextUrl.pathname}`, nextUrl));
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// Use Node.js runtime to support mongoose
export const runtime = 'nodejs';
