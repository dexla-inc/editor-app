import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Rating",
    description: "Rating",
    props: {
      readOnly: true,
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
