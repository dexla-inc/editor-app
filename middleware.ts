import { getByDomain } from "@/requests/projects/queries-noauth";
import { isLiveUrl } from "@/utils/common";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Implement your authentication check here

  const hostName = request.headers.get("host"); // e.g 7648e8ac8af14ea885a8ca1e200aa81d.localhost:3000
  if (!hostName) {
    return NextResponse.next();
  }

  const matchingUrl = isLiveUrl(hostName);
  if (!matchingUrl) {
    return NextResponse.next();
  }

  // Check if the request is for static files or API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const project = await getByDomain(hostName);

  if (!project.redirectSlug) {
    return NextResponse.next();
  }

  const signInSlug = `/${project.redirectSlug ?? ""}`;

  // Need to add a config to check if the user has authentication enabled
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

  if (!refreshToken && refreshToken === "undefined") {
    return false;
  }
  // Implement your authentication logic here
  // For example, check for a valid cookie or token
  // Return true if the user is authenticated, false otherwise
  return true;
}
