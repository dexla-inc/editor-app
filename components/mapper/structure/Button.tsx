import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { value, textColor, color, ...rest } = props.props ?? {};

  const defaultValues = requiredModifiers.button;

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    props: {
      children: value ?? "Button",
      ...defaultValues,
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
    },
    states: {
      hover: { color: "Primary.7" },
      disabled: {
        color: "Neutral.6",
        textColor: "Neutral.9",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
