import { Fragment, PropsWithChildren, memo } from "react";
import InitialisePropelAuth from "@/components/InitialisePropelAuth";
import { useCheckIfIsLive } from "@/hooks/useCheckIfIsLive";

const AuthProvider = memo(({ children }: PropsWithChildren<{}>) => {
  const isLive = useCheckIfIsLive();

  if (isLive) {
    return <Fragment>{children}</Fragment>;
  }
  return <InitialisePropelAuth>{children}</InitialisePropelAuth>;
});

AuthProvider.displayName = "AuthProvider";

export default AuthProvider;
