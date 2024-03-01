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
    width: "100%",
    height: "auto",
    minHeight: "100px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
