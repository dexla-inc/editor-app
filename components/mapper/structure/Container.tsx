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
    width: propStyle?.width || "fit-content",
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
      dataType: "static",
    },
    ...(props?.children && { children: props.children }),
    ...(props?.states && { states: props.states }),
  };
};
