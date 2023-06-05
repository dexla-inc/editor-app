import { useAppStore } from "@/stores/app";
import { TypeAnimation } from "react-type-animation";

type Props = {
  text: string;
  onlyWhileLoading?: boolean;
};

export const TypingAnimation = ({ text, onlyWhileLoading = true }: Props) => {
  const isLoading = useAppStore((state) => state.isLoading);

  if (!isLoading && onlyWhileLoading) {
    return <>{text}</>;
  }

  return <TypeAnimation speed={70} cursor={false} sequence={[text]} />;
};
