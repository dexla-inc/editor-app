import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Checkbox",
    description: "Checkbox",
    props: {
      style: {
        width: "fit-content",
        height: "fit-content",
      },
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Neutral.7", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
  };
};
