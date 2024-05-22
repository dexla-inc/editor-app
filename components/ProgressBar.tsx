import { ReactNode } from "react";
import { theme } from "@/utils/branding";
import { AppProgressBar } from "next-nprogress-bar";

interface Props {
  children: ReactNode;
}

export const ProgressBar: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <AppProgressBar
        height="4px"
        color={theme.colors.Primary?.[6]}
        options={{ showSpinner: false }}
      />
    </>
  );
};
