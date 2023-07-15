import { defaultTheme } from "@/components/IFrame";
import { PageResponse } from "@/requests/pages/types";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const pages = props.pages ?? [];

  return {
    id: nanoid(),
    name: "Navbar",
    description: "Navbar",
    props: {
      style: {
        width: "300px",
        height: "100vh",
        backgroundColor: "white",
        paddingTop: "10px",
        paddingRight: "10px",
        paddingBotom: "10px",
        paddingLeft: "10px",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: theme.colors.Border
          ? theme.colors.Border[6]
          : theme.colors.gray[3],
      },
      ...(props.props || {}),
      fixedPosition: "left",
    },
    children: pages.map((page: PageResponse) => {
      return {
        id: nanoid(),
        name: "Container",
        description: "Navbar Item",
        props: {
          style: {
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "center",
            paddingTop: "10px",
            paddingRight: "10px",
            paddingBotom: "10px",
            paddingLeft: "10px",
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
              children: page.title,
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
                marginLeft: "10px",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      };
    }),
  };
};
