import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = (path: string) => {
  const publicPaths = [
    "/", // Public homepage
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/razorpay/webhook",
  ];
  return publicPaths.some((pattern) => {
    const regex = new RegExp(`^${pattern.replace("*", ".*")}$`);
    return regex.test(path);
  });
};

export default clerkMiddleware(async (authFn, req) => {
  const auth = await authFn(); // Await authentication object
  // ✅ Redirect unauthenticated users from private pages to /sign-in
  if (!auth.userId && !isPublicRoute(req.nextUrl.pathname)) {
    return auth.redirectToSignIn();
  }
  // ✅ Redirect authenticated users from public pages to /create
  if (auth.userId && isPublicRoute(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/create", req.nextUrl.origin));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
