import { defaultTheme } from "@/components/IFrame";
import { defaultImageValues } from "@/components/modifiers/Image";
import { PageResponse } from "@/requests/pages/types";
import { MantineThemeExtended } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { IconHome } from "@tabler/icons-react";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = (props.theme ?? defaultTheme) as MantineThemeExtended;
  const pages = (props.pages ?? [
    {
      id: nanoid(),
      title: "Dashboard",
    },
    {
      id: nanoid(),
      title: "Application Form",
    },
  ]) as PageResponse[];

  const darkLogo = theme.logos?.find((logo) => logo.type === "DARK");
  const lightLogo = theme.logos?.find((logo) => logo.type === "LIGHT");

  const logoUrl =
    darkLogo?.url ||
    lightLogo?.url ||
    "https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-4.svg";

  return {
    id: nanoid(),
    name: "Navbar",
    description: "Navbar",
    props: {
      style: {
        width: "260px",
        height: "100vh",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: "#CCCCCC",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        gap: "0px",
        backgroundColor: darkLogo ? "#fff" : theme.colors.dark[6],
      },
      ...(props.props || {}),
    },
    fixedPosition: { position: "left", target: "root" },
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
            padding: "20px",
            borderBottomStyle: "solid",
            borderBottomWidth: "1px",
            borderBottomColor: darkLogo
              ? theme.colors.gray[3]
              : theme.colors.gray[5],
            margin: "0 10px",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Image",
            description: "Image",
            props: {
              style: {
                width: "auto",
                height: "34px",
                ...defaultImageValues,
              },
              src: logoUrl,
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
            padding: "20px 10px",
          },
        },
        children: pages
          .filter((page: PageResponse) => page.hasNavigation)
          .map((page: PageResponse) => {
            return {
              id: nanoid(),
              name: "NavLink",
              description: "Navbar Item",
              props: {
                icon: "IconHome",
                label: page.title,
                isNested: !!page.parentPageId,
                pageId: page.id,
                style: {
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  color: darkLogo ? theme.colors.dark[9] : theme.colors.gray[5],
                },
                sx: {
                  borderRadius: "3px",
                  "&:hover": {
                    backgroundColor: darkLogo
                      ? theme.colors.gray[0]
                      : theme.colors.dark[4],
                  },
                },
                actions: [
                  {
                    trigger: "onClick",
                    action: {
                      name: "navigateToPage",
                      pageId: page.id,
                    },
                  },
                ],
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
