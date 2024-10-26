import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): any => {
  const { value, textColor, color, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    props: {
      children: value ?? "Button",
      type: "button",
      variant: "filled",
      icon: "",
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      style: {
        gridColumn: "1/12",
        gridRow: "1/4",
      },
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
