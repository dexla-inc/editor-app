import { GRID_SIZE } from "@/utils/config";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const initialGridValues = requiredModifiers.grid;
  const initialGridColumnValues = requiredModifiers.gridColumn;

  return {
    id: nanoid(),
    name: "Grid",
    description: "Grid",
    props: {
      gridSize: GRID_SIZE,
      ...initialGridValues,
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "GridColumn",
        description: "GridColumn",
        props: {
          span: GRID_SIZE / 2,
          ...initialGridColumnValues,
        },
      },
      {
        id: nanoid(),
        name: "GridColumn",
        description: "GridColumn",
        props: {
          span: GRID_SIZE / 2,
          ...initialGridColumnValues,
        },
      },
    ],
  };
};
