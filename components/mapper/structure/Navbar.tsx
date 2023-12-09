import { defaultImageValues } from "@/components/modifiers/Image";
import { initialValues } from "@/components/modifiers/Navbar";
import { PageResponse } from "@/requests/pages/types";
import { MantineThemeExtended } from "@/stores/editor";
import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = (props.theme ?? defaultTheme) as MantineThemeExtended;

  const pages = (
    props.pages && props.pages.length > 0
      ? props.pages
      : [
          {
            id: nanoid(),
            title: "Dashboard",
          },
          {
            id: nanoid(),
            title: "Application Form",
          },
        ]
  ) as PageResponse[];

  const bottomPages = [
    { id: nanoid(), title: "Help", icon: "IconHelp", isNested: false },
    { id: nanoid(), title: "Settings", icon: "IconSettings", isNested: false },
  ];

  const darkLogo = theme.logos?.find((logo) => logo.type === "DARK");
  const lightLogo = theme.logos?.find((logo) => logo.type === "LIGHT");

  const logoUrl =
    darkLogo?.url ||
    lightLogo?.url ||
    "https://dexlastatesdev.blob.core.windows.net/editor/1e176c4b3b784ddd98e161a9b4d0a48c_fakeLogo.svg" ||
    "https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-4.svg";

  const isDarkTheme = lightLogo ? true : false;

  return {
    id: nanoid(),
    name: "Navbar",
    description: "Navbar",
    props: {
      ...merge({
        style: {
          ...initialValues,
        },
        ...props.props,
      }),
    },
    fixedPosition: { position: "left", target: "content-wrapper" },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Logo",
        props: {
          style: {
            display: "flex",
            flexDirection: "row",
            gap: "10px",
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
                width: "34px",
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
            name: "Container",
            description: "User Details",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Text",
                description: "Username",
                props: {
                  children: "JohnDoe14",
                  color: `${
                    theme.colors.Black ? "Black.6" : theme.colors.dark[6]
                  }`,
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
              {
                id: nanoid(),
                name: "Text",
                description: "Plan",
                props: {
                  children: "Premium",
                  color: "Black.3",
                  size: "xs",
                  weight: "normal",
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
        description: "Can Delete Containier",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            gap: "40px",
            minHeight: "calc(100vh - 74px)",
            height: "auto",
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
            description: "Nav Links",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                height: "auto",
              },
            },
            children: pages.map((page) => ({
              id: page.id,
              name: "NavLink",
              description: "Nav Link",
              props: {
                icon: page.icon ?? "IconLayoutDashboard",
                label: page.title,
                isNested: !!page.parentPageId,
                style: {
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  color: isDarkTheme
                    ? theme.colors.gray[5]
                    : theme.colors.dark[9],
                  borderRadius: "3px",
                },
              },
              blockDroppingChildrenInside: true,
              actions: [
                {
                  id: nanoid(),
                  trigger: "onClick",
                  action: {
                    name: "navigateToPage",
                    pageId: "",
                  },
                },
              ],
              children: [],
              states: {
                Active: {
                  bg: "Neutral.0",
                  style: {
                    borderRadius: theme.spacing.sm,
                  },
                },
                hover: {
                  bg: "Neutral.5",
                  style: {
                    borderRadius: theme.spacing.sm,
                  },
                },
              },
            })),
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
                name: "Container",
                description: "Container for NavLinks",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                  },
                },
                children: bottomPages.map((page) => ({
                  id: page.id,
                  name: "NavLink",
                  description: "Navbar Item",
                  props: {
                    icon: page.icon,
                    label: page.title,
                    isNested: page.isNested,
                    style: {
                      width: "100%",
                      height: "auto",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      color: isDarkTheme
                        ? theme.colors.gray[5]
                        : theme.colors.dark[9],
                    },
                  },
                  actions: [
                    {
                      id: nanoid(),
                      trigger: "onClick",
                      action: {
                        name: "navigateToPage",
                        pageId: "",
                      },
                    },
                  ],
                  children: [],
                  states: {
                    Active: {
                      bg: "Neutral.0",
                      style: {
                        borderRadius: theme.spacing.sm,
                      },
                    },
                    hover: {
                      bg: "Neutral.5",
                      style: {
                        borderRadius: theme.spacing.sm,
                      },
                    },
                  },
                })),
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
                      src: "https://dexlastatesdev.blob.core.windows.net/editor/1e176c4b3b784ddd98e161a9b4d0a48c_profile.png",
                      style: { width: "40px", height: "40px" },
                    },
                    children: [],
                    actions: [],
                    blockDroppingChildrenInside: true,
                  },
                  {
                    id: nanoid(),
                    name: "Container",
                    description: "Profile Details",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      },
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Name",
                        props: {
                          children: "John Doe",
                          color: `${
                            theme.colors.Black
                              ? "Black.6"
                              : theme.colors.dark[6]
                          }`,
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
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Email",
                        props: {
                          children: "johnDoe14@gmail.com",
                          color: "gray.5",
                          size: "xs",
                          weight: "normal",
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
      },
    ],
  };
};
