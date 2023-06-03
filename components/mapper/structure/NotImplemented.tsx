import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => ({
  id: nanoid(),
  name: "Stack",
  columns: props.columns || 12,
  description: "NotImplement Stack",
  props: {
    w: "100%",
    align: "center",
    justify: "center",
    spacing: 2,
    py: "lg",
  },
  children: [
    {
      id: nanoid(),
      name: "Text",
      columns: 0,
      description: "NotImplement Component Name",
      children: [],
      props: {
        children: props.name,
        size: "sm",
      },
    },
    {
      id: nanoid(),
      name: "Text",
      columns: 0,
      description: "NotImplement Text",
      children: [],
      props: {
        children: "Not implemented yet",
        size: "xs",
        color: "dimmed",
      },
    },
  ],
});
