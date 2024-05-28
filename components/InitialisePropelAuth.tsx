import { RedirectToLogin, RequiredAuthProvider } from "@propelauth/react";
import { PropsWithChildren } from "react";

const authUrl = process.env.NEXT_PUBLIC_AUTH_URL as string;
const authRedirectUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL as string;

export default function InitialisePropelAuth({ children }: PropsWithChildren) {
  return (
    <RequiredAuthProvider
      authUrl={authUrl}
      // TODO: GET THIS BACK
      // displayWhileLoading={<LoadingOverlay visible overlayBlur={2} />}
      displayIfLoggedOut={
        <RedirectToLogin postLoginRedirectUrl={authRedirectUrl} />
      }
    >
      {children}
    </RequiredAuthProvider>
  );
}
