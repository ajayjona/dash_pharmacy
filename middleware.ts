import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const role = req.nextauth.token?.role;
    const pathname = req.nextUrl.pathname;

    // 1. Prevent logged-in users from visiting auth pages
    const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/admin/auth');
    if (isAuthPage) {
      if (isAuth) {
        // Redirect based on role
        if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', req.url));
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null; // Allow access to unauthenticated users
    }

    // 2. Admin Routes Protection (/admin/*)
    if (pathname.startsWith('/admin')) {
      if (!isAuth) {
        // Unauthenticated -> send to Admin Login
        return NextResponse.redirect(new URL(`/admin/auth/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
      }
      if (role !== 'ADMIN') {
        // Authenticated but not an admin -> send to home page
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null; // Admin user -> allow
    }

    // 3. Ordinary User Routes Protection (/checkout, /orders, etc.)
    const userProtectedRoutes = ['/checkout', '/orders', '/profile'];
    const isUserRoute = userProtectedRoutes.some(route => pathname.startsWith(route));

    if (isUserRoute) {
      if (!isAuth) {
        // Unauthenticated -> send to User Login
        return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url));
      }
      return null; // Authenticated user -> allow
    }
    
    return null;
  },
  {
    callbacks: {
      // Return true to ensure the middleware function above always runs,
      // giving us full control over redirects for unauthenticated users
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*', 
    '/checkout/:path*', 
    '/orders/:path*', 
    '/profile/:path*',
    '/auth/:path*'
  ],
};
