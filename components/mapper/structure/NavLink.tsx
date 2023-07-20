import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "NavLink",
    description: "Navigation Item",
    props: {
      label: "Navigation Item",
      style: {
        width: "auto",
        height: "auto",
      },
      // ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
