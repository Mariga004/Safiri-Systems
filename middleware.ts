import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Defining public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/welcome(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Protection logic
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // no user id no public route (route isn't accessible if userid isn't provided)
  if (!isPublicRoute(req) && !userId) {
    return Response.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};