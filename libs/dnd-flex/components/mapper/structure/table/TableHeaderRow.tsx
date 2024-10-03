import { Component, ComponentStructure } from "@/utils/editor";
import merge from "lodash.merge";
import { nanoid } from "nanoid";

export const jsonStructure = (
  props?: Partial<Component>,
): ComponentStructure => {
  return merge(
    {
      id: nanoid(),
      name: "TableHeaderRow",
      description: "TableHeaderRow",
      props: {
        style: {},
      },
      children: [],
    },
    props,
  );
};
