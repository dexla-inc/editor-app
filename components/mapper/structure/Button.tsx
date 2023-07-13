import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    props: {
      style: {
        width: "auto",
        height: "auto",
        paddingTop: px(theme.spacing.sm),
        paddingBottom: px(theme.spacing.sm),
        paddingLeft: px(theme.spacing.lg),
        paddingRight: px(theme.spacing.lg),
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Button Text",
        children: [],
        props: {
          children: "New Button",
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            color: "white",
            width: "auto",
            height: "auto",
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
