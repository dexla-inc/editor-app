import { getByDomain } from "@/requests/projects/queries-noauth";
import { NextRequest, NextResponse } from "next/server";

// TODO: Add a page that will be redirected
// Add datasource configuration pane back for general and auth, endpoints need to be configured in settings so add a link
// Add a redirect to page when user is not signed in. This should only happen on deployed apps.

export async function middleware(request: NextRequest) {
  // Implement your authentication check here

  const hostName = request.headers.get("host"); // e.g 7648e8ac8af14ea885a8ca1e200aa81d.localhost:3000
  if (!hostName) {
    return NextResponse.next();
  }

  const matchingUrl = isMatchingUrl(hostName);
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

  if (!refreshToken) {
    return false;
  }
  // Implement your authentication logic here
  // For example, check for a valid cookie or token
  // Return true if the user is authenticated, false otherwise
  return true;
}

function isMatchingUrl(url: string): boolean {
  // check if url follow the pattern: 7eacfa0cbb8b406cbc2b40085b9c37a4.dexla.io or 7eacfa0cbb8b406cbc2b40085b9c37a4.dexla.ai
  // where 7eacfa0cbb8b406cbc2b40085b9c37a4 is the project id and can be any string that contains only letters and numbers,
  // but always has 32 characters and a mix of letters and numbers
  const pattern = new RegExp(
    "^[a-zA-Z0-9]{32}\\.dexla\\.(io|ai|localhost:3000)$",
  );
  return pattern.test(url) || url?.endsWith(".localhost:3000");
}
