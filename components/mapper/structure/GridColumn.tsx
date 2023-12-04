import { initialValues } from "@/components/modifiers/GridColumn";
import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "GridColumn",
    description: "GridColumn",
    props: {
      span: GRID_SIZE / 2,
      bg: "white",
      style: {
        ...initialValues,
        height: "auto",
        border: "2px dotted #ddd",
      },
    },
  };
};
