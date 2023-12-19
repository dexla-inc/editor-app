import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "NavLink",
    description: "Nav Link",
    props: {
      icon: "IconLayoutDashboard",
      label: "Nav Link",
      style: {
        ...requiredModifiers.navLink,
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
