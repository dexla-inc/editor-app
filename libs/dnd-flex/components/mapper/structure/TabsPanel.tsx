import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "TabsPanel",
    description: "Tabs Panel",
    props: {
      value: "new-tab",
      style: {
        width: "auto",
        height: "auto",
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
          children: "New Tab Content",
          color: "Black.6",
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
