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
    "New link";

  return {
    id: nanoid(),
    name: "Link",
    description: "Link",
    props: {
      children: content,
      style: {
        width: "auto",
        height: "auto",
        fontSize: `${px(theme.fontSizes.sm)}px`,
        fontWeight: "normal",
        lineHeight: "110%",
        letterSpacing: "0px",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
