import { initialValues as initialGridValues } from "@/components/modifiers/Grid";
import { initialValues as initialGridColumnValues } from "@/components/modifiers/GridColumn";
import { GRAY_OUTLINE } from "@/utils/branding";
import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Grid",
    description: "Grid",
    props: {
      m: 0,
      p: 0,
      gridSize: GRID_SIZE,
      gridDirection: "column",
      gap: "xs",
      style: {
        ...initialGridValues,
        width: "100%",
        height: "auto",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "GridColumn",
        description: "GridColumn",
        props: {
          span: GRID_SIZE / 2,
          style: {
            ...initialGridColumnValues,
            height: "100%",
            outline: GRAY_OUTLINE,
            outlineOffset: "-2px",
          },
        },
      },
      {
        id: nanoid(),
        name: "GridColumn",
        description: "GridColumn",
        props: {
          span: GRID_SIZE / 2,
          style: {
            ...initialGridColumnValues,
            height: "100%",
            outline: GRAY_OUTLINE,
            outlineOffset: "-2px",
          },
        },
      },
    ],
  };
};
