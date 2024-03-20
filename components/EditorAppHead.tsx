import React from "react";
import { useCheckIfIsLive } from "@/hooks/useCheckIfIsLive";
import { ProgressBar } from "./ProgressBar";
import InstantiatePropelAuthStore from "@/components/InstantiatePropelAuthStore";
import { theme } from "@/utils/branding";

export const EditorAppHead = () => {
  const isLive = useCheckIfIsLive();

  return !isLive ? (
    <>
      <ProgressBar color={theme.colors.teal[6]} />
      <InstantiatePropelAuthStore />
    </>
  ) : null;
};
