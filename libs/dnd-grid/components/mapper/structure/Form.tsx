import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";
import { IDENTIFIER } from "@/utils/branding";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { style: propsStyle, ...rest } = props?.props || {};

  const { style: defaultStyle, ...restProps } = requiredModifiers.layout;
  const style = {
    ...propsStyle,
    ...IDENTIFIER,
    gridColumn: "1/30",
    gridRow: "1/10",
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
