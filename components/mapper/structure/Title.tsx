import { defaultBorderValues } from "@/components/modifiers/Border";
import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { order = 1, ...rest } = props.props || {};
  const size = theme.headings.sizes[`h${order}`];
  const content =
    props.props?.children ??
    props.props?.content ??
    props.props?.text ??
    props.props?.value ??
    "New title";

  return {
    id: nanoid(),
    name: "Title",
    description: "Title",
    children: [],
    props: {
      children: content,
      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
      order: order,
      style: {
        fontWeight: "bold",
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
        width: "auto",
        height: "auto",
        ...defaultBorderValues,
      },
      ...(rest || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
