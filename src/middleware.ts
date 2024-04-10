import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";

const protectedRoutes = ["/newDirector"];

interface MyToken extends JwtPayload {
    _id: string;
    role: string[];
}

export default function middleware(req: NextRequest) {
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
   
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
        const absoluteURL = new URL("/signIn", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }

    const decodedToken = jwtDecode<MyToken>(token);

    if (decodedToken.role[0] !== 'admin') {
        const errorURL = new URL("/error", req.nextUrl.origin);
        return NextResponse.redirect(errorURL.toString());
      }
  }
}
