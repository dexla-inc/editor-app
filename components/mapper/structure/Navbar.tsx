import { defaultImageValues } from "@/components/modifiers/Image";
import { PageResponse } from "@/requests/pages/types";
import { defaultTheme } from "@/utils/branding";
import { ComponentStructure, getColorFromTheme } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { MantineThemeExtended } from "@/types/types";
import merge from "lodash.merge";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = (props.theme ?? defaultTheme) as MantineThemeExtended;
  const initialValues = requiredModifiers.navbar;

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
          showBorder: "bottom",
          style: {
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            padding: "20px",
            borderBottomStyle: "solid",
            borderBottomWidth: "1px",
            borderBottomColor: isDarkTheme
              ? getColorFromTheme(theme, "Border.6")
              : getColorFromTheme(theme, "Border.4"),
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
          // This needs moving in a container with space between of a logo
          // {
          //   id: nanoid(),
          //   name: "ButtonIcon",
          //   description: "Button to toggle Navbar",
          //   props: {
          //     style: {
          //       position: "absolute",
          //       top: "20px",
          //       right: "-20px",
          //       width: "auto",
          //       height: "auto",
          //       cursor: "pointer",
          //       zIndex: 10,
          //     },
          //     radius: "xl",
          //   },
          //   actions: [
          //     {
          //       id: nanoid(),
          //       trigger: "onClick",
          //       action: { name: "changeState", conditionRules: [] },
          //     },
          //   ],
          //   blockDroppingChildrenInside: true,
          //   children: [
          //     {
          //       id: nanoid(),
          //       name: "Icon",
          //       description: "Icon",
          //       props: {
          //         name: "IconChevronLeft",
          //       },
          //     },
          //   ],
          // },
        ],
      },
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
        // @ts-ignore
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
              color: isDarkTheme ? theme.colors.gray[5] : theme.colors.dark[9],
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
                pageSlug: "",
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
            Hover: {
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
            // @ts-ignore
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
                    pageSlug: "",
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
                padding: "10px",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Avatar",
                description: "Avatar",
                props: {
                  radius: "xl",
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
  };
};
