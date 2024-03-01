import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { style: propStyle, ...restProps } = props?.props || {};

  const defaultValues = requiredModifiers.layout;
  const { style: defaultStyle, ...restDefaultValues } = defaultValues;

  const mergedStyle = {
    ...defaultStyle,
    ...propStyle,
    width: propStyle?.width || "100%",
    height: propStyle?.height || "auto",
    minHeight: propStyle?.minHeight || "100px",
    padding: propStyle?.padding || "20px",
    flex: propStyle?.flex || "1 0 auto",
    flexDirection: propStyle?.flexDirection || "column",
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
