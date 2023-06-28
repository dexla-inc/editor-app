import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
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
        name: "Accordion",
        description: "Accordion",
        props: {
          defaultValue: "first",
          style: {
            width: "100%",
            height: "auto",
          },
          ...(props.props || {}),
        },
        children: [
          {
            id: nanoid(),
            name: "AccordionItem",
            description: "Accordion Item",
            props: {
              value: "first",
              style: {
                width: "100%",
                height: "auto",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "AccordionControl",
                description: "Accordion Control",
                props: {
                  style: {
                    width: "100%",
                    height: "auto",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Accordion Text",
                    children: [],
                    props: {
                      children: "First Item",
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "normal",
                        lineHeight: "110%",
                        letterSpacing: "0px",
                        color: theme.colors.dark[6],
                        width: "auto",
                        heigh: "auto",
                      },
                    },
                    blockDroppingChildrenInside: true,
                  },
                ],
              },
              {
                id: nanoid(),
                name: "AccordionPanel",
                description: "Accordion Panel",
                props: {
                  style: {
                    width: "100%",
                    height: "auto",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Accordion Text",
                    children: [],
                    props: {
                      children: "First Item Text",
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "normal",
                        lineHeight: "110%",
                        letterSpacing: "0px",
                        color: theme.colors.dark[6],
                        width: "auto",
                        heigh: "auto",
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
            name: "AccordionItem",
            description: "Accordion Item",
            props: {
              value: "second",
              style: {
                width: "100%",
                height: "auto",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "AccordionControl",
                description: "Accordion Control",
                props: {
                  style: {
                    width: "100%",
                    height: "auto",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Accordion Text",
                    children: [],
                    props: {
                      children: "Second Item",
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "normal",
                        lineHeight: "110%",
                        letterSpacing: "0px",
                        color: theme.colors.dark[6],
                        width: "auto",
                        heigh: "auto",
                      },
                    },
                    blockDroppingChildrenInside: true,
                  },
                ],
              },
              {
                id: nanoid(),
                name: "AccordionPanel",
                description: "Accordion Panel",
                props: {
                  style: {
                    width: "100%",
                    height: "auto",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Accordion Text",
                    children: [],
                    props: {
                      children: "Second Item Text",
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "normal",
                        lineHeight: "110%",
                        letterSpacing: "0px",
                        color: theme.colors.dark[6],
                        width: "auto",
                        heigh: "auto",
                      },
                    },
                    blockDroppingChildrenInside: true,
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
