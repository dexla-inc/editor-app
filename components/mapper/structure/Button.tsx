import { defaultTheme } from "@/components/IFrame";
import { defaultButtonValues } from "@/components/modifiers/Button";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { value, textColor, color, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    props: {
      ...defaultButtonValues,
      style: {
        width: "auto",
        height: "auto",
        padding: `${px(theme.spacing.sm)}px`,
      },
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
      children: value ?? "New Button",
    },
    blockDroppingChildrenInside: true,
  };
};
