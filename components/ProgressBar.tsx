import { theme } from "@/utils/branding";
import NextTopLoader from "nextjs-toploader";

export const ProgressBar: React.FC = () => {
  const color = theme.colors.teal[6];
  return <NextTopLoader color={color} />;
};
