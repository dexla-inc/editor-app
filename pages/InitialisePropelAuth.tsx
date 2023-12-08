import { LoadingOverlay } from "@mantine/core";
import { RedirectToLogin, RequiredAuthProvider } from "@propelauth/react";
import { PropsWithChildren } from "react";

export function InitialisePropelAuth({ children }: PropsWithChildren) {
  console.log("InitialisePropelAuth");
  // user is injected automatically from withRequiredAuthInfo below
  return (
    <RequiredAuthProvider
      authUrl={process.env.NEXT_PUBLIC_AUTH_URL as string}
      displayWhileLoading={<LoadingOverlay visible overlayBlur={2} />}
      displayIfLoggedOut={
        <RedirectToLogin
          postLoginRedirectUrl={
            process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL as string
          }
        />
      }
    >
      {children}
    </RequiredAuthProvider>
  );
}

// withRequiredAuthInfo is a React Higher-Order Component that provides common values like isLoggedIn and accessToken.
// These values are injected into the props of your component.
// Unlike withAuthInfo, withRequiredAuthInfo will make sure the user is logged in
