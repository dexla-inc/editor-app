import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import InitialisePropelAuth from "./InitialisePropelAuth";

export default function AuthProvider({
  children,
  isLive,
}: PropsWithChildren & { isLive: boolean }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [isClient]);

  if (!isClient) return null;

  if (isLive) {
    return <Fragment>{children}</Fragment>;
  }

  return !isLive && <InitialisePropelAuth>{children}</InitialisePropelAuth>;
}
