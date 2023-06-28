import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "AccordionItem",
    description: "Accordion Item",
    props: {
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
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
              children: "Item Text",
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
              children: "Item Text",
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
  };
};
