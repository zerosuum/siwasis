// middleware.js
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};


export function middleware(req) {
  const sid = req.cookies.get("sid")?.value;
  if (!sid) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
