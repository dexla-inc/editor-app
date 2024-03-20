import { LoadingOverlay } from "@mantine/core";
import { RedirectToLogin, RequiredAuthProvider } from "@propelauth/react";
import { PropsWithChildren, memo } from "react";

const authUrl = process.env.NEXT_PUBLIC_AUTH_URL as string;
const authRedirectUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL as string;

const InitialisePropelAuth = memo(({ children }: PropsWithChildren<{}>) => {
  return (
    <RequiredAuthProvider
      authUrl={authUrl}
      displayWhileLoading={<LoadingOverlay visible overlayBlur={2} />}
      displayIfLoggedOut={
        <RedirectToLogin postLoginRedirectUrl={authRedirectUrl} />
      }
    >
      {children}
    </RequiredAuthProvider>
  );
});

InitialisePropelAuth.displayName = "InitialisePropelAuth";

export default InitialisePropelAuth;
