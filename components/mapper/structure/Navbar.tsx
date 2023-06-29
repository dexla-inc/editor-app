import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Navbar",
    description: "Navbar",
    props: {
      style: {
        width: "300px",
        height: "100vh",
        backgroundColor: "white",
      },
      ...(props.props || {}),
      fixedPosition: "left",
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
              color: `${theme.colors.Black ? "Black" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
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
