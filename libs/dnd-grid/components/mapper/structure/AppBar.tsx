import { GRAY_OUTLINE } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "AppBar",
    description: "App Bar",
    props: {
      style: {
        gridColumn: "1 / -1",
        gridRow: "1/6",
      },
    },
    fixedPosition: { position: "top", target: "main-content" },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Container",
        props: {
          style: {
            gridColumn: "1/20",
            gridRow: "1/6",
            outline: GRAY_OUTLINE,
            outlineOffset: "-2px",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Input",
            description: "Search",
            props: {
              variant: "default",
              radius: "md",
              type: "search",
              size: "sm",
              icon: {
                props: { name: "IconSearch" },
              },
              placeholder: "Search anything...",
              style: {
                gridColumn: "2/19",
                gridRow: "1/4",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
      {
        id: nanoid(),
        name: "Container",
        description: "Container",
        props: {
          style: {
            gridColumn: "20/26",
            gridRow: "1/6",
            outline: GRAY_OUTLINE,
            outlineOffset: "-2px",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Container",
            description: "Container",
            props: {
              style: {
                gridColumn: "1/6",
                gridRow: "1/6",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Icon",
                description: "Icon",
                children: [],
                props: {
                  name: "IconBell",
                  style: {
                    gridColumn: "1/4",
                    gridRow: "2/5",
                  },
                },
                blockDroppingChildrenInside: true,
              },
              {
                id: nanoid(),
                name: "Icon",
                description: "Icon",
                children: [],
                props: {
                  name: "IconSettings",
                  style: {
                    gridColumn: "6/9",
                    gridRow: "2/5",
                  },
                },
                blockDroppingChildrenInside: true,
              },
              {
                id: nanoid(),
                name: "Icon",
                description: "Icon",
                children: [],
                props: {
                  name: "IconUser",
                  style: {
                    gridColumn: "10/13",
                    gridRow: "2/5",
                  },
                },
                blockDroppingChildrenInside: true,
              },
            ],
          },
        ],
      },
    ],
  };
};
