import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Container",
    description: "Button Container",
    props: {
      style: {
        marginTop: px(theme.spacing.xl),
        marginBottom: px(theme.spacing.xl),
        marginLeft: px(theme.spacing.xl),
        marginRight: px(theme.spacing.xl),
        width: "100%",
        height: "auto",
        minHeight: "100px",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Button",
        description: "Button",
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
                heigh: "auto",
              },
              ...(props.props || {}),
            },
          },
        ],
      },
    ],
  };
};
