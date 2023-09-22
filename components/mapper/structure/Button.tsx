import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";
import { defaultBorderValues } from "@/components/modifiers/Border";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { value, textColor, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    props: {
      style: {
        ...defaultBorderValues,
        width: "auto",
        height: "auto",
        padding: px(theme.spacing.sm),
      },
      ...(rest || {}),
      textColor: textColor ?? "White.0",
      children: value ?? "New Button",
    },
    blockDroppingChildrenInside: true,
  };
};
