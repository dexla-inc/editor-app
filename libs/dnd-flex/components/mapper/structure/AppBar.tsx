import { GRAY_OUTLINE } from "@/utils/branding";
import { GRID_SIZE } from "@/utils/config";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const initialGridValues = requiredModifiers.grid;
  const initialGridColumnValues = requiredModifiers.gridColumn;

  return {
    id: nanoid(),
    name: "AppBar",
    description: "App Bar",
    props: {
      gap: "xs",
      gridSize: GRID_SIZE,
      style: {
        ...initialGridValues,
        width: "100%",
        height: "auto",
      },
    },
    fixedPosition: { position: "top", target: "main-content" },
    children: [
      {
        id: nanoid(),
        name: "GridColumn",
        description: "GridColumn",
        props: {
          span: GRID_SIZE / 2,
          style: {
            ...initialGridColumnValues,
            height: "auto",
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
                maxWidth: "400px",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
      {
        id: nanoid(),
        name: "GridColumn",
        description: "GridColumn",
        props: {
          span: GRID_SIZE / 2,
          style: {
            ...initialGridColumnValues,
            height: "auto",
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
                justifyContent: "flex-end",
                alignItems: "center",
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
                  size: 20,
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
                  size: 20,
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
                  size: 20,
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
