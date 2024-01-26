import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { style: propStyle, ...restProps } = props?.props || {};
  const defaultValues = requiredModifiers.layout;

  const { style: defaultStyle, ...restDefaultValues } = defaultValues;

  const mergedStyle = {
    ...defaultStyle,
    ...propStyle,
    width: propStyle?.width || "100%",
    height: propStyle?.height || "auto",
    minHeight: propStyle?.minHeight || "20px",
  };

  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    props: {
      ...restDefaultValues,
      ...restProps,
      style: mergedStyle,
      data: restProps.data,
    },
  };
};
