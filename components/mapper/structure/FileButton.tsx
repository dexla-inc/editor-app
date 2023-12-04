import { defaultBorderValues } from "@/components/modifiers/Border";
import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { name, style, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "FileButton",
    description: "Upload Files",
    props: {
      style: {
        ...defaultBorderValues,
        width: "auto",
        height: "auto",
        padding: px(theme.spacing.sm),
        ...(style || {}),
      },
      name: name ?? "Upload button",
      ...(rest || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
