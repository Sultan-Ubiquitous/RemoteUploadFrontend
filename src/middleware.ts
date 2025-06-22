import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import apiClient from "./lib/api";
import axios from "axios";

export async function middleware(req: NextRequest) {
    const sessionCookie = getSessionCookie(req);
    const {pathname} = req.nextUrl;
    const onBoardingStatus = await axios.get('http://localhost:8008/onboardingStatus', {
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
      withCredentials: true,
    });
    const isOnBoarded = onBoardingStatus.data.msg;
    
    if(!sessionCookie){
       return NextResponse.redirect(new URL("/signin", req.url));
    }
    
    if(!isOnBoarded && pathname !== '/onboarding'){
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }


    
   return NextResponse.next();
}

export const config = {
  matcher: ["/testing", "/isthisworking", "/dashboard", "/upload", "/upload-to-youtube"],
};
