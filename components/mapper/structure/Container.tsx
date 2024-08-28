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
    width: "auto",
    height: "auto",
    gridColumn: "1/10",
    gridRow: "1/15",
    display: "grid",
    gridTemplateColumns: "subgrid",
    gridTemplateRows: "subgrid",
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
