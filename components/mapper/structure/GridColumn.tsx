import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const initialValues = requiredModifiers.gridColumn;

  return {
    id: nanoid(),
    name: "GridColumn",
    description: "GridColumn",
    props: {
      span: GRID_SIZE / 2,
      ...initialValues,
      ...(props.props || {}),
    },
  };
};
