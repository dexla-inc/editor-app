import { getProject } from "@/requests/projects/queries-noauth";
import { isLiveUrl } from "@/utils/common";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const hostName = request.headers.get("host"); // e.g 7648e8ac8af14ea885a8ca1e200aa81d.localhost:3000
  if (!hostName) {
    return NextResponse.next();
  }

  const appUrl = isLiveUrl(hostName, request.nextUrl.pathname);
  if (!appUrl) {
    return NextResponse.next();
  }

  // Check if the request is for static files or API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const project = await getProject(hostName, true);

  if (!project.redirectSlug) {
    return NextResponse.next();
  }

  const signInSlug = `/${project.redirectSlug ?? ""}`;

  const userIsAuthenticated = checkUserAuthentication(request);
  if (userIsAuthenticated) {
    return NextResponse.next();
  }

  // Check if the current request is already for the sign-in page
  if (request.nextUrl.pathname === signInSlug) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = signInSlug;
  return NextResponse.redirect(url);
}

function checkUserAuthentication(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");

  if (!refreshToken || refreshToken.toString() === "undefined") {
    return false;
  }

  return true;
}
