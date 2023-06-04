import { TypeAnimation } from "react-type-animation";

type Props = {
  text: string;
};

export const TypingAnimation = ({ text }: Props) => {
  return <TypeAnimation speed={70} cursor={false} sequence={[text]} />;
};
