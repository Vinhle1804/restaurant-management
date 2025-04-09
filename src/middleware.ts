import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./constants/type";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const onlyOwnerPaths = ["/manage/accounts"]
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  //1. truong hop chua dang nhap
  //chua dang nhap thi k cho vao privatePath
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens','true')
    return NextResponse.redirect(url);
  }
//2. truong hop da dang nhap
if(refreshToken){
//2.1 neu co tinh vao trang login thi cho ve trang home
if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
  return NextResponse.redirect(new URL("/", request.url));
}
 //2.2 truong hop dang nhap r nhung accessToken het han
 if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken ) {
  const url = new URL("/refresh-token", request.url);
  url.searchParams.set("refreshToken",refreshToken);
  url.searchParams.set("redirect",pathname)
  return NextResponse.redirect(url);
}

//2.3 vao k dung route thi redirect ve trang home
const role = decodeToken(refreshToken).role
//guest nhung co tinh vao rou owner
const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path)=> pathname.startsWith(path))
//k phai guest nhung co tinh vao guest path
const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path)=> pathname.startsWith(path))
//khong phai owner nhung co tinh truy cap vao cac route owner
const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path))
if(isGuestGoToManagePath|| isNotGuestGoToGuestPath || isNotOwnerGoToOwnerPath) {
  return NextResponse.redirect(new URL("/", request.url));

}


return NextResponse.next();
}
}

  
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*","/guest/:path*", "/login"],
};
