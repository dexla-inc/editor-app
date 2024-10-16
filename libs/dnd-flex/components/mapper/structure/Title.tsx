import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";
import merge from "lodash.merge";

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
      order: order,
      ...(rest || {}),
    }),
    blockDroppingChildrenInside: true,
  };
};
