import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { value, textColor, color, ...rest } = props.props ?? {};

  const defaultValues = requiredModifiers.countdownButton;

  return {
    id: nanoid(),
    name: "CountdownButton",
    description: "Countdown",
    props: {
      children: value ?? "Resend in ",
      ...defaultValues,
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
    },
    states: {
      hover: { color: "Primary.7" },
      disabled: {
        color: "Neutral.6",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
