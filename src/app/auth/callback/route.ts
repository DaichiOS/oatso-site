import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Auth Callback Route Handler
 *
 * This endpoint handles two authentication flows:
 *
 * 1. Code-based Authentication Flow:
 * - Used for email confirmations and OAuth providers
 * - Provider redirects to this endpoint with a 'code' query parameter
 * - Code is exchanged for a session using exchangeCodeForSession()
 * - Session is automatically stored in cookies by Supabase client
 *
 * 2. Hash-based Authentication Flow:
 * - Used for magic link and some OAuth providers
 * - Auth data is passed in URL hash fragment (#access_token=...)
 * - Hash is processed client-side by Supabase Auth listener via onAuthStateChange
 * - onAuthStateChange detects SIGNED_IN event and handles redirect
 * - No server-side handling needed as hash never reaches server
 *
 * After successful authentication:
 * - User is redirected to home page
 * - AuthHandler component listens for auth state changes via onAuthStateChange
 * - When SIGNED_IN event detected, AuthHandler redirects to dashboard
 * - Auth tokens are securely stored in cookies
 *
 * Note on onAuthStateChange:
 * - Subscribes to auth state changes in AuthHandler component
 * - Triggers on events like SIGNED_IN, SIGNED_OUT, USER_UPDATED
 * - Handles post-authentication flows like redirects
 * - Cleans up hash fragments from URL for security
 *
 */

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const supabase = createRouteHandlerClient({ cookies });

  if (code) {
    // Exchange the code for a session
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session) {
      // Set the session
      await supabase.auth.setSession(session);

      // Create a response with the redirect
      const response = NextResponse.redirect(new URL(next, requestUrl.origin));

      // Set auth cookies
      response.cookies.set("sb-access-token", session.access_token, {
        secure: true,
        sameSite: "lax",
        path: "/",
      });
      response.cookies.set("sb-refresh-token", session.refresh_token, {
        secure: true,
        sameSite: "lax",
        path: "/",
      });

      return response;
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
