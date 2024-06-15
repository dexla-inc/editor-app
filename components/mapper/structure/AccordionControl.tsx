import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "AccordionControl",
    description: "Accordion Control",
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
        name: "Text",
        description: "Accordion Text",
        children: [],
        props: {
          children: "First Item Text",
          color: "Black.6",
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
