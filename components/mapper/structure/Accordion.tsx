import { defaultTheme } from "@/components/IFrame";
import { defaultBorderValues } from "@/components/modifiers/Border";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Container",
    description: "Accordion Container",
    props: {
      style: {
        paddingTop: px(theme.spacing.xl),
        paddingBottom: px(theme.spacing.xl),
        paddingLeft: px(theme.spacing.xl),
        paddingRight: px(theme.spacing.xl),
        width: "100%",
        height: "auto",
        ...defaultBorderValues,
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Accordion",
        description: "Accordion",
        props: {
          defaultValue: "first",
          variant: "separated",
          icon: "IconPlus",
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
                      children: "Lorem ipsum",
                      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "bold",
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
                      children:
                        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit, consequatur cupiditate expedita vero quas rerum eos voluptatem possimus, illo maiores quis! Tempora autem cum itaque dicta officiis vitae enim rerum magni in facilis ullam corporis sint praesentium, aspernatur sit doloremque? Suscipit veniam nobis corrupti, odio adipisci laborum neque! Rerum, amet.",
                      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "normal",
                        lineHeight: "150%",
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
                      children: "Dolor Sit",
                      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "bold",
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
                      children:
                        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit, consequatur cupiditate expedita vero quas rerum eos voluptatem possimus, illo maiores quis! Tempora autem cum itaque dicta officiis vitae enim rerum magni in facilis ullam corporis sint praesentium, aspernatur sit doloremque? Suscipit veniam nobis corrupti, odio adipisci laborum neque! Rerum, amet.",
                      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
                      style: {
                        fontSize: `${px(theme.fontSizes.sm)}px`,
                        fontWeight: "normal",
                        lineHeight: "150%",
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
      },
    ],
  };
};
