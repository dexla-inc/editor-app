import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
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
      style: {
        fontSize: `${px(theme.fontSizes.sm)}px`,
        fontWeight: "normal",
        lineHeight: "110%",
        letterSpacing: "0px",
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
