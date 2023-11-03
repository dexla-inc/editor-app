import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Alert",
    description: "Alert",
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "AlertText",
        children: [],
        props: {
          children: "Alert text",
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
      },
    ],
    props: {
      title: "Alert",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
  };
};
