import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Tab",
    description: "Tab",
    props: {
      style: {
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Tab Text",
        children: [],
        onLoad: {
          children: {
            dataType: "static",
            value: "Tab Text",
          },
        },
        props: {
          color: `${theme.colors.Black ? "Black.6" : "dark"}`,
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "auto",
            height: "auto",
          },
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
