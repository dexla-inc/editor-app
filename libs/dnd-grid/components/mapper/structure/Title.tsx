import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";
import merge from "lodash.merge";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { order = 1, ...rest } = props.props || {};

  return {
    id: nanoid(),
    name: "Title",
    description: "Title",
    children: [],
    props: merge(
      {},
      {
        children: "New Title",
        color: "Black.6",
        order: 1,
        style: {
          gridColumn: "1/7",
          gridRow: "1/5",
        },
      },
    ),
    blockDroppingChildrenInside: true,
  };
};
