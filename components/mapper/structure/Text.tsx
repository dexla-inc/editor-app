import { defaultBorderValues } from "@/components/modifiers/Border";
import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
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
    props: {
      children: content,
      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
      size: "sm",
      weight: "normal",
      style: {
        lineHeight: "110%",
        letterSpacing: "0px",
        width: "auto",
        height: "auto",
        ...defaultBorderValues,
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
