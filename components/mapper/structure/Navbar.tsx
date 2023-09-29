import { defaultTheme } from "@/components/IFrame";
import { defaultImageValues } from "@/components/modifiers/Image";
import { PageResponse } from "@/requests/pages/types";
import { MantineThemeExtended } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import merge from "lodash.merge";

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

  const isDarkTheme = lightLogo ? true : false;

  return {
    id: nanoid(),
    name: "Navbar",
    description: "Navbar",
    props: {
      ...merge({
        style: {
          width: "260px",
          height: "auto",
          minHeight: "100vh",
          borderRightWidth: "1px",
          borderRightStyle: "solid",
          borderRightColor: "#CCCCCC",
          display: "flex",
          flexDirection: "column",
          flexGrow: "1",
          gap: "0px",
          top: 0,
          left: 0,
          background: isDarkTheme ? theme.colors.dark[6] : "#fff",
        },
        ...props.props,
      }),
    },
    fixedPosition: { position: "left", target: "root" },
    children: [
      {
        id: nanoid(),
        name: "ButtonIcon",
        description: "Button to toggle Navbar",
        props: {
          style: {
            position: "absolute",
            right: "-5%",
            top: "20px",
            width: "auto",
            height: "auto",
            cursor: "pointer",
            zIndex: 10,
          },
          radius: "xl",
        },
        actions: [
          {
            id: nanoid(),
            trigger: "onClick",
            action: { name: "toggleNavbar" },
          },
        ],
        blockDroppingChildrenInside: true,
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "Icon",
            props: {
              name: "IconChevronLeft",
            },
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            borderBottomStyle: "solid",
            borderBottomWidth: "1px",
            borderBottomColor: isDarkTheme
              ? theme.colors.gray[5]
              : theme.colors.gray[3],
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
                maxWidth: "180px",
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
        description: "Container for navigation links",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
            height: "auto",
            minHeight: "100vh",
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
                  color: isDarkTheme
                    ? theme.colors.gray[5]
                    : theme.colors.dark[9],
                  borderRadius: "3px",
                },
              },
              actions: [
                {
                  id: nanoid(),
                  trigger: "onClick",
                  action: {
                    name: "navigateToPage",
                    pageId: page.id,
                  },
                },
              ],
              children: [],
            };
          }),
      },
    ],
  };
};
