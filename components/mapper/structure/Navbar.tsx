import { defaultTheme } from "@/components/IFrame";
import { defaultImageValues } from "@/components/modifiers/Image";
import { PageResponse } from "@/requests/pages/types";
import { Component } from "@/utils/editor";
import { IconHome } from "@tabler/icons-react";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const pages = props.pages ?? [];
  const logoUrl =
    theme.logoUrl ??
    "https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-2.svg";

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
        borderRightColor: "gray.1",
        display: "flex",
        flexDirection: "column",
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
                height: "50px",
                ...defaultImageValues,
              },
              src:
                logoUrl ??
                "https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-4.svg",
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
      {
        id: nanoid(),
        name: "Container",
        description: "Container for Image and Icon",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
          },
        },
        children: pages
          .filter((page: PageResponse) => page.hasNavigation)
          .map((page: PageResponse) => {
            return {
              id: nanoid(),
              name: "NavLink",
              description: "Navbar Item",
              icon: <IconHome size="1rem" stroke={1.5} />,
              props: {
                label: page.title,
                isNested: !!page.parentPageId,
                pageId: page.id,
                style: {
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                },
              },
              children: [],
            };
          }),
      },
      {
        id: nanoid(),
        name: "Menu",
        description: "Profile Menu",
        props: {
          style: {
            width: "100%",
            height: "auto",
          },
        },
        children: [],
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
