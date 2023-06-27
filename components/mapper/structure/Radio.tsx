import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Container",
    description: "Radio Container",
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
        name: "Radio",
        description: "Radio",
        props: {
          label: "Radio Label",
          style: {
            width: "100%",
            height: "auto",
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
