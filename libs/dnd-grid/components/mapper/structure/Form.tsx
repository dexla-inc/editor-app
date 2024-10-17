import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { style: propsStyle, ...rest } = props?.props || {};

  const { style: defaultStyle, ...restProps } = requiredModifiers.layout;
  const style = {
    ...propsStyle,
    ...defaultStyle,
    paddingLeft: "0px",
    paddingRight: "0px",
    marginBottom: "0px",
    gridColumn: "1/30",
    gridRow: "1/30",
  };

  return {
    id: nanoid(),
    name: "Form",
    description: "Form",
    props: {
      ...(rest || {}),
      ...(restProps || {}),
      dataType: "dynamic",
      style,
    },
    children: props.children ?? [],
  };
};
