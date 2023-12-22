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
    "New badge";

  return {
    id: nanoid(),
    name: "Badge",
    description: "Badge",
    children: [],
    props: {
      children: content,
      radius: "xl",
      size: "md",
      color: "PrimaryText.6",
      bg: "Primary.6",
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
