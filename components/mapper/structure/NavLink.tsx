import { Component } from "@/utils/editor";
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
        width: "100%",
        height: "auto",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        color: "Black.6",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
