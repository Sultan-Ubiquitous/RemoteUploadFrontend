import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(req: NextRequest) {
    const sessionCookie = getSessionCookie(req);

    if(!sessionCookie){
       return NextResponse.redirect(new URL("/signin", req.url));
    }

   return NextResponse.next();
}

export const config = {
  matcher: ["/testing", "/isthisworking"],
};


// import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";
 
// export async function middleware(request: NextRequest) {
// 	const sessionCookie = getSessionCookie(request);
 
// 	if (!sessionCookie) {
// 		return NextResponse.redirect(new URL("/signin", request.url));
// 	}
 
// 	return NextResponse.next();
// }
 
// export const config = {
// 	matcher: ["/testing"], // Specify the routes the middleware applies to
// };