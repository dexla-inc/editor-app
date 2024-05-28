import { Fragment, PropsWithChildren } from "react";
import InitialisePropelAuth from "./InitialisePropelAuth";

export default function AuthProvider({
  children,
  isLive,
}: PropsWithChildren & { isLive: boolean }) {
  if (isLive) {
    return <Fragment>{children}</Fragment>;
  }

  return !isLive && <InitialisePropelAuth>{children}</InitialisePropelAuth>;
}
