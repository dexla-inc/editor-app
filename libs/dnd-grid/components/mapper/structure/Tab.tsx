import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Tab",
    description: "Tab",
    props: {
      style: {
        gridColumn: "1/6",
        gridRow: "1/3",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Tab Text",
        children: [],
        props: {
          children: "Tab Text",
          color: "Black.6",
          style: {
            gridColumn: "1/6",
            gridRow: "1/3",
          },
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
