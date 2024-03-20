import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import InitialisePropelAuth from "@/components/InitialisePropelAuth";
import { useCheckIfIsLive } from "@/hooks/useCheckIfIsLive";

export default function AuthProvider({ children }: PropsWithChildren) {
  const isLive = useCheckIfIsLive();
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
