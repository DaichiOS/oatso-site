import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected routes (excluding auth routes)
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];
// Define auth routes (redirect if logged in)
const AUTH_ROUTES = ["/login", "/signup"];
// Define public routes (no auth needed)
const PUBLIC_ROUTES = ["/auth/callback"];

export async function middleware(request: NextRequest) {
  // Create a Supabase client with the request
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    // Get the current path
    const path = request.nextUrl.pathname;

    // Skip middleware for public routes
    if (PUBLIC_ROUTES.some((route) => path.startsWith(route))) {
      return res;
    }

    // Get the session from the cookie
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Set the session in the response
    if (session) {
      await supabase.auth.setSession(session);
    }

    console.log("Debug - Full session data:", {
      path,
      hasSession: !!session,
      sessionUser: session?.user?.email,
      isAuthRoute: AUTH_ROUTES.some((route) => path === route),
      isProtectedRoute: PROTECTED_ROUTES.some((route) =>
        path.startsWith(route)
      ),
    });

    // Handle auth routes (login/signup)
    if (AUTH_ROUTES.some((route) => path === route)) {
      if (session) {
        // If logged in, redirect to home
        const response = NextResponse.redirect(new URL("/", request.url));
        // Copy over the session cookie
        response.cookies.set(
          "sb-access-token",
          res.cookies.get("sb-access-token")?.value || ""
        );
        response.cookies.set(
          "sb-refresh-token",
          res.cookies.get("sb-refresh-token")?.value || ""
        );
        return response;
      }
      return res;
    }

    // Handle protected routes
    if (PROTECTED_ROUTES.some((route) => path.startsWith(route))) {
      if (!session) {
        // If not logged in, redirect to login
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("from", path);
        return NextResponse.redirect(redirectUrl);
      }
      return res;
    }

    // Handle home route
    if (path === "/") {
      if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return res;
    }

    // Default: allow access
    return res;
  } catch (e) {
    console.error("Auth middleware error:", e);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
    "/auth/callback",
  ],
};
