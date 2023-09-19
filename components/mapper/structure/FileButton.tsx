import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { value, textColor, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "FileButton",
    description: "File Button",
    props: {
      style: {
        width: "auto",
        height: "auto",
        padding: px(theme.spacing.sm),
      },
      ...(rest || {}),
      textColor: textColor ?? "White.0",
      //children: value ?? "Upload file",
      multiple: true,
      accept: "*",
    },
    blockDroppingChildrenInside: true,
  };
};
