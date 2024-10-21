import { GRID_SIZE } from "@/utils/config";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
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
