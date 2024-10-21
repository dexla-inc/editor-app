import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";
import merge from "lodash.merge";
import { requiredModifiers } from "@/utils/modifiers";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { order = 1, ...rest } = props.props || {};

  const defaultTextValues = requiredModifiers.text;

  return {
    id: nanoid(),
    name: "Title",
    description: "Title",
    children: [],
    props: merge({}, defaultTextValues, {
      children: "New Title",
      color: "Black.6",
      order: 1,
      style: {
        gridColumn: "1/12",
        gridRow: "1/5",
      },
    }),
    blockDroppingChildrenInside: true,
  };
};
