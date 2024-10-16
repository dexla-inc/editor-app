import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { style: propStyle, ...restProps } = props?.props || {};

  const defaultValues = requiredModifiers.layout;
  const { style: defaultStyle, ...restDefaultValues } = defaultValues;

  const mergedStyle = {
    ...propStyle,
    padding: propStyle?.padding,
    gridColumn: "1/30",
    gridRow: "1/10",
  };

  return {
    id: nanoid(),
    name: "Card",
    description: "Card",
    props: {
      ...restDefaultValues,
      ...restProps,
      style: mergedStyle,
      bg: restProps.bg || "White.6",
    },
  };
};
