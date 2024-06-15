import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
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
                  color: "Black.6",
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
              color: "Black.6",
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
