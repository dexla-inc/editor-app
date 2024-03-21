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

  return null;
}

export default withRequiredAuthInfo(InstantiatePropelAuthStore);
