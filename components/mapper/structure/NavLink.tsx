import { Component } from "@/utils/editor";
import { IconHome } from "@tabler/icons-react";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "NavLink",
    description: "Navigation Item",
    props: {
      label: "Navigation Item",
      icon: IconHome,
      style: {
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
