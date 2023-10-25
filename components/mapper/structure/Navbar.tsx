import { defaultTheme } from "@/components/IFrame";
import { defaultImageValues } from "@/components/modifiers/Image";
import { PageResponse } from "@/requests/pages/types";
import { MantineThemeExtended } from "@/stores/editor";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";
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

  const isDarkTheme = lightLogo ? true : false;

  return {
    id: nanoid(),
    name: "Navbar",
    description: "Navbar",
    props: {
      ...merge({
        style: {
          width: "260px",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          flexGrow: "1",
          gap: "0px",
          backgroundColor: isDarkTheme ? theme.colors.dark[6] : "#fff",
        },
        ...props.props,
      }),
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
            borderBottomColor: isDarkTheme
              ? theme.colors.gray[5]
              : theme.colors.gray[3],
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
          {
            id: nanoid(),
            name: "ButtonIcon",
            description: "Button to toggle Navbar",
            props: {
              style: {
                position: "absolute",
                top: "20px",
                right: "-20px",
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
                action: { name: "changeState", conditionRules: [] },
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
        ],
      },
      {
        id: nanoid(),
        name: "Container",
        description: "Container for Pages and Avatar",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            height: "100%",
            // minHeight: "100vh",
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingLeft: "10px",
            paddingRight: "10px",
          },
        },
        children: [
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
                    label: page.title,
                    isNested: !!page.parentPageId,
                    pageId: page.id,
                    style: {
                      width: "100%",
                      height: "auto",
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "10px",
                      paddingBottom: "10px",
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
                  states: {
                    Active: {
                      bg: "transparent",
                      color: "Primary.6",
                    },
                    hover: {
                      bg: "transparent",
                      color: "Primary.4",
                    },
                  },
                };
              }),
          },
          {
            id: nanoid(),
            name: "Container",
            description: "Footer",
            props: {
              style: { display: "flex", flexDirection: "column", gap: "10px" },
            },
            children: [
              {
                id: nanoid(),
                name: "NavLink",
                description: "Navbar Item",
                props: {
                  label: "Documentation",
                  isNested: false,
                  style: {
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "10px",
                    paddingBottom: "10px",
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
                      name: "goToUrl",
                      url: "",
                      openInNewTab: true,
                    },
                  },
                ],
                children: [],
                states: {
                  Active: {
                    bg: "transparent",
                    color: "Primary.6",
                  },
                  hover: {
                    bg: "transparent",
                    color: "Primary.4",
                  },
                },
              },
              {
                id: nanoid(),
                name: "Container",
                description: "Container for Avatar",
                props: {
                  style: {
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    cursor: "pointer",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Avatar",
                    description: "Avatar",
                    props: {
                      radius: "xl",
                      children: "JD",
                    },
                    children: [],
                    actions: [],
                    blockDroppingChildrenInside: true,
                  },
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Name",
                    props: {
                      children: "John Doe",
                      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
                      size: "md",
                      weight: "bold",
                      style: {
                        lineHeight: "110%",
                        letterSpacing: "0px",
                        width: "auto",
                        height: "auto",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};
