import { defaultTheme } from "@/components/IFrame";
import { PageResponse } from "@/requests/pages/types";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const pages = props.pages ?? [];
  const { value } = props.props ?? {};

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
            name: "NavLink",
            description: "Navbar Item",
            props: {
              label: page.title,
              isNested: !!page.parentPageId,
              pageId: page.id,
              style: {
                width: "100%",
                height: "auto",
                display: "flex",
                alignItems: "center",
                paddingTop: theme.spacing.sm,
                paddingBottom: theme.spacing.sm,
              },
            },
            children: [],
          };
        }),
    ],
  };
};
