import { defaultTheme } from "@/components/IFrame";
import { defaultModalValues } from "@/components/modifiers/Modal";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  const defaultChildren = [
    {
      id: nanoid(),
      name: "Text",
      description: "Text",
      props: {
        children: "Modal content",
        color: `${theme.colors.Black ? "Black.6" : "dark"}`,
        style: {
          fontSize: "16px",
          fontWeight: "normal",
          lineHeight: "110%",
          letterSpacing: "0px",
          width: "auto",
          height: "auto",
        },
      },
      blockDroppingChildrenInside: true,
    },
  ];

  return {
    id: nanoid(),
    name: "Modal",
    description: "Modal",
    props: {
      ...(props.props || {}),
      ...defaultModalValues,
    },
    children: props.children ?? defaultChildren,
  };
};
