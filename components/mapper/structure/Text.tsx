import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";
import merge from "lodash.merge";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const defaultValues = requiredModifiers.text;
  const content =
    props.props?.children ??
    props.props?.content ??
    props.props?.text ??
    props.props?.value ??
    "New text";

  return {
    id: nanoid(),
    name: "Text",
    description: "Text",
    children: [],
    onLoad: {
      children: {
        value: "New Text",
        dataType: "static",
      },
    },
    props: merge({}, defaultValues, {
      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
      size: "sm",
      style: {
        lineHeight: "110%",
        letterSpacing: "0px",
        fontWeight: "normal",
      },
      ...(props.props || {}),
    }),
    blockDroppingChildrenInside: true,
  };
};
