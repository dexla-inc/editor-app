import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Container",
    description: "Tabs Container",
    props: {
      style: {
        marginTop: px(theme.spacing.xl),
        marginBottom: px(theme.spacing.xl),
        marginLeft: px(theme.spacing.xl),
        marginRight: px(theme.spacing.xl),
        width: "100%",
        height: "auto",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Tabs",
        description: "Tabs",
        props: {
          defaultValue: "first",
          style: {
            width: "auto",
            height: "auto",
          },
          ...(props.props || {}),
        },
        children: [
          {
            id: nanoid(),
            name: "TabsList",
            description: "Tabs List",
            props: {
              style: {
                width: "auto",
                height: "auto",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Tab",
                description: "Tab",
                props: {
                  value: "first",
                  style: {
                    width: "auto",
                    height: "auto",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Tab Text",
                    children: [],
                    props: {
                      children: "First Tab",
                      color: `${theme.colors.Black ? "Black" : "dark"}`,
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "normal",
                        lineHeight: "110%",
                        letterSpacing: "0px",
                        width: "auto",
                        height: "auto",
                      },
                    },
                    blockDroppingChildrenInside: true,
                  },
                ],
              },
              {
                id: nanoid(),
                name: "Tab",
                description: "Tab",
                props: {
                  value: "second",
                  style: {
                    width: "auto",
                    height: "auto",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Tab Text",
                    children: [],
                    props: {
                      children: "Second Tab",
                      color: `${theme.colors.Black ? "Black" : "dark"}`,
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "normal",
                        lineHeight: "110%",
                        letterSpacing: "0px",
                        width: "auto",
                        height: "auto",
                      },
                    },
                    blockDroppingChildrenInside: true,
                  },
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "TabsPanel",
            description: "Tabs Panel",
            props: {
              value: "first",
              style: {
                paddingTop: px(theme.spacing.xl),
                width: "auto",
                height: "auto",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Text",
                description: "Tab Text",
                children: [],
                props: {
                  children: "First Tab",
                  color: `${theme.colors.Black ? "Black" : "dark"}`,
                  style: {
                    fontSize: `${px(theme.fontSizes.sm)}px`,
                    fontWeight: "normal",
                    lineHeight: "110%",
                    letterSpacing: "0px",
                    width: "auto",
                    height: "auto",
                  },
                },
                blockDroppingChildrenInside: true,
              },
            ],
          },
          {
            id: nanoid(),
            name: "TabsPanel",
            description: "TabsPanel",
            props: {
              value: "second",
              style: {
                paddingTop: px(theme.spacing.xl),
                width: "auto",
                height: "auto",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Text",
                description: "Tab Text",
                children: [],
                props: {
                  children: "Second Tab",
                  color: `${theme.colors.Black ? "Black" : "dark"}`,
                  style: {
                    fontSize: `${px(theme.fontSizes.sm)}px`,
                    fontWeight: "normal",
                    lineHeight: "110%",
                    letterSpacing: "0px",
                    width: "auto",
                    height: "auto",
                  },
                },
                blockDroppingChildrenInside: true,
              },
            ],
          },
        ],
      },
    ],
  };
};
