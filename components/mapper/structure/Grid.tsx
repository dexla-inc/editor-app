import { initialValues as initialGridValues } from "@/components/modifiers/Grid";
import { initialValues as initialGridColumnValues } from "@/components/modifiers/GridColumn";
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
            height: "auto",
            border: "2px dotted #ddd",
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
            height: "auto",
            border: "2px dotted #ddd",
          },
        },
      },
    ],
  };
};
