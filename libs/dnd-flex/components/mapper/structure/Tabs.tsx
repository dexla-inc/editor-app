import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
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
                props: {
                  children: "First Tab",
                  color: "Black.6",
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
                props: {
                  children: "Second Tab",
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
        name: "TabsPanel",
        description: "Tabs Panel",
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
              children: "First Tab Content",
              color: "Black.6",
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
              children: "Second Tab Content",
              color: "Black.6",
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
