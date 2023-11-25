import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Grid",
    description: "Grid",
    props: {
      bg: "white",
      m: 0,
      p: 0,
      gridSize: GRID_SIZE,
      gap: "xs",
      style: {
        width: "100%",
        height: "auto",
        minHeight: "50px",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "GridColumn",
        description: "GridColumn",
        props: {
          span: GRID_SIZE / 2,
          bg: "white",
          style: {
            height: "auto",
            minHeight: "50px",
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
          bg: "white",
          style: {
            height: "auto",
            minHeight: "50px",
            border: "2px dotted #ddd",
          },
        },
      },
    ],
  };
};
