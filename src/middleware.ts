import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';


const isOnboardingRote = createRouteMatcher(['/onboarding']);
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/hello']) ;
const isAdminRoute = createRouteMatcher(['/admin(.*)', '/upload(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if(userId && isOnboardingRote(req)){
    return NextResponse.next();
  }

  if(isAdminRoute(req) && (sessionClaims?.metadata?.role !== 'owner')){
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl);
  }

  if (!userId && !isPublicRoute(req)) {
    await auth.protect();
  }
  //here I can just get onBoardingComplete status from Prisma but I will leave it here to make things easy
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/onboarding', req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  if (userId && !isPublicRoute(req)) return NextResponse.next();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}