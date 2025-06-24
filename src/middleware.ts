import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import axios from "axios";

export async function middleware(req: NextRequest) {
    const sessionCookie = getSessionCookie(req);
    const {pathname} = req.nextUrl;
    
    if(!sessionCookie){
       return NextResponse.redirect(new URL("/signin", req.url));
    }

    try {
      
    const onBoardingStatus = await axios.get('http://localhost:8008/onboarding/onboardingStatus', {
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
      withCredentials: true,
    });
    const isOnBoarded = onBoardingStatus.data.msg;
    
    
    
    if(!isOnBoarded && pathname !== '/onboarding'){
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    
} catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Clear invalid session and redirect to signin
            const response = NextResponse.redirect(new URL("/signin", req.url));
            // Optionally clear cookies here if needed
            return response;
    }
  }

  return NextResponse.next();

}
export const config = {
  matcher: ["/testing", "/isthisworking", "/dashboard", "/upload", "/upload-to-youtube"],
};
