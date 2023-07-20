import { defaultTheme } from "@/components/IFrame";
import { PageResponse } from "@/requests/pages/types";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const pages = props.pages ?? [];
  const { value } = props.props ?? {};

  console.log({ theme });
  return {
    id: nanoid(),
    name: "Navbar",
    description: "Navbar",
    props: {
      style: {
        width: "300px",
        height: "100vh",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: "gray.3",
      },
      bg: "white",
      ...(props.props || {}),
      fixedPosition: "left",
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Container for Image and Icon",
        props: {
          style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Image",
            description: "Image",
            props: {
              style: {
                width: "150px",
                height: "auto",
              },
              src: "https://uploads-ssl.webflow.com/62a0c6d2136bdf9c8a2e41ef/6372524a20f971a3d46319ba_Logo.svg",
            },
            children: [],
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Icon",
            description: "Icon",
            props: {
              style: {
                width: "auto",
                height: "auto",
              },
              name: "IconArrowBarLeft",
            },
            children: [],
            blockDroppingChildrenInside: true,
          },
        ],
      },
      ...pages
        .filter(
          (page: PageResponse) =>
            page.title !== "Sign Up" &&
            page.title !== "Sign In" &&
            page.title !== "Forgot Password"
        ) // Will add a back end flag here for hidden pages
        .map((page: PageResponse) => {
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
                paddingRight: "16px",
                paddingBottom: "10px",
                paddingLeft: "16px",
              },
              sx: {
                "&:hover": {
                  backgroundColor: "teal",
                  cursor: "pointer",
                  color: "white",
                },
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Icon",
                description: "Navbar Item Icon",
                props: {
                  style: {
                    width: "auto",
                    height: "auto",
                  },
                },
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
    ],
  };
};
