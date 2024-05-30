import { useAuthInfo } from "@propelauth/react";

export const usePropelAuth = () => {
  const auth = useAuthInfo();

  const refreshAuth = () => {
    auth.refreshAuthInfo();
  };

  return {
    auth,
    refreshAuth,
  };
};
