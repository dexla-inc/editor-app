import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = props.theme ?? defaultTheme;

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
            name: "Container",
            description: "Container",
            props: {
              style: {
                alignItems: "center",
                height: "50px",
                paddingLeft: "20px",
                paddingRight: "20px",
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
                  color: `${theme.colors.Black ? "Black.6" : "dark"}`,
                  style: {
                    fontSize: `${px(theme.fontSizes.sm)}px`,
                    fontWeight: "normal",
                    lineHeight: "110%",
                    letterSpacing: "0px",
                    width: "fit-content",
                    height: "fit-content",
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
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "fit-content",
                height: "fit-content",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
