import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { style, ...rest } = props?.props || {};

  const defaultLayoutValues = requiredModifiers.layout;

  return {
    id: nanoid(),
    name: "Form",
    description: "Form",
    props: {
      style: {
        ...defaultLayoutValues,
        paddingLeft: "0px",
        paddingRight: "0px",
        marginBottom: "0px",
        width: "100%",
        height: "auto",
        minHeight: "100px",
        flexDirection: "column",
        rowGap: "20px",
        columnGap: "20px",
        alignItems: "center",
        justifyContent: "center",
        ...(style || {}),
      },
      ...(rest || {}),
    },
    children: props.children ?? [],
  };
};
