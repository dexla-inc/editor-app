import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import merge from "lodash.merge";

export const jsonStructure = (props?: Partial<Component>): Component => {
  return merge(
    {
      id: nanoid(),
      name: "TableCell",
      description: "TableCell",
      props: {
        style: {},
      },
      children: [],
    },
    props,
  );
};
