import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Tabs",
    description: "Tabs",
    props: {
      defaultValue: "first",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
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
        blockDroppingChildrenInside: true,
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
            blockDroppingChildrenInside: true,
            children: [
              {
                id: nanoid(),
                name: "Text",
                description: "Tab Text",
                children: [],
                onLoad: {
                  children: {
                    dataType: "static",
                    value: "First Tab",
                  },
                },
                props: {
                  color: `${theme.colors.Black ? "Black.6" : "dark"}`,
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
            blockDroppingChildrenInside: true,
            children: [
              {
                id: nanoid(),
                name: "Text",
                description: "Tab Text",
                children: [],
                onLoad: {
                  children: {
                    dataType: "static",
                    value: "Second Tab",
                  },
                },
                props: {
                  color: `${theme.colors.Black ? "Black.6" : "dark"}`,
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
            onLoad: {
              children: {
                dataType: "static",
                value: "First Tab Content",
              },
            },
            props: {
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
                padding: theme.spacing.md,
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
            onLoad: {
              children: {
                dataType: "static",
                value: "Second Tab Content",
              },
            },
            props: {
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
                padding: theme.spacing.md,
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
