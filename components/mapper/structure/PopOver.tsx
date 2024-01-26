import { defaultPopOverValues } from "@/components/modifiers/PopOver";
import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  return {
    id: nanoid(),
    name: "PopOver",
    description: "PopOver",
    props: {
      ...(props.props || {}),
      ...defaultPopOverValues,
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Container",
        props: {
          style: {
            width: "auto",
            backgroundColor: "white.6",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            onLoad: {
              children: {
                dataType: "static",
                value: "This is a PopOver",
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
              ...(props.props || {}),
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
