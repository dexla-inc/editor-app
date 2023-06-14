import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Navbar",
    description: "Navbar",
    props: {
      style: {
        width: "300px",
        height: "100%",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Navbar Item",
        props: {
          style: {
            width: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "Navbar Item Icon",
            props: {},
            children: [],
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Navbar Item Text",
            children: [],
            props: {
              children: "New Link",
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.dark[6],
                width: "auto",
                heigh: "auto",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
