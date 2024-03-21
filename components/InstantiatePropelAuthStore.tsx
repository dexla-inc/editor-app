import { usePropelAuthStore } from "@/stores/propelAuth";
import { WithAuthInfoProps } from "@propelauth/react";
import { useEffect } from "react";

import { withRequiredAuthInfo } from "@propelauth/react";

function InstantiatePropelAuthStore(props: WithAuthInfoProps) {
  const initializeAuth = usePropelAuthStore((state) => state.initializeAuth);
  useEffect(() => {
    initializeAuth(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // user is injected automatically from withRequiredAuthInfo below
  return null;
}

// withRequiredAuthInfo is a React Higher-Order Component that provides common values like isLoggedIn and accessToken.
// These values are injected into the props of your component.
// Unlike withAuthInfo, withRequiredAuthInfo will make sure the user is logged in
export default withRequiredAuthInfo(InstantiatePropelAuthStore);
