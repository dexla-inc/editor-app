import { NextRequest, NextResponse } from "next/server";

// TODO: Add a page that will be redirected
// Add datasource configuration pane back for general and auth, endpoints need to be configured in settings so add a link
// Add a redirect to page when user is not signed in. This should only happen on deployed apps.

export function middleware(request: NextRequest) {
  // Implement your authentication check here

  const hostName = request.headers.get("host") ?? "";
  const matchingUrl =
    isMatchingUrl(hostName) || hostName?.endsWith(".localhost:3000");
  if (!matchingUrl) {
    return NextResponse.next();
  }

  const userIsAuthenticated = checkUserAuthentication(request); // Replace with your actual logic

  const url = request.nextUrl.clone();
  if (!userIsAuthenticated && !url.pathname.startsWith("/signin")) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function checkUserAuthentication(request: NextRequest) {
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
  return pattern.test(url);
}
