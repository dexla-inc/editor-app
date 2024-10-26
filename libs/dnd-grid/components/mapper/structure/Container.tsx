import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";
import { requiredModifiers } from "@/utils/modifiers";
import { IDENTIFIER } from "@/utils/branding";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { style: propStyle, ...restProps } = props?.props || {};
  const defaultValues = requiredModifiers.layout;

  const { style: defaultStyle, ...restDefaultValues } = defaultValues;

  const mergedStyle = {
    ...propStyle,
    ...IDENTIFIER,
    gridColumn: "1/30",
    gridRow: "1/10",
  };

  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    blockDroppingChildrenInside: false,
    props: {
      ...restDefaultValues,
      ...restProps,
      style: mergedStyle,
      data: restProps.data,
      dataType: "static",
      bg: "bg-gray-100",
    },
  };
};
