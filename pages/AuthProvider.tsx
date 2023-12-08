import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { InitialisePropelAuth } from "./InitialisePropelAuth";

export const AuthProvider = ({
  children,
  isLive,
}: PropsWithChildren & { isLive: boolean }) => {
  const [isClient, setIsClient] = useState(false);

  console.log("AuthProvider");

  useEffect(() => {
    setIsClient(true);
  }, [isClient]);

  if (!isClient) return null;

  if (isLive) {
    return <Fragment>{children}</Fragment>;
  }

  return !isLive && <InitialisePropelAuth>{children}</InitialisePropelAuth>;
};
