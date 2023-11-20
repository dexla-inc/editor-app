import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "ButtonIcon",
    description: "ButtonIcon",
    props: {
      style: {
        width: "auto",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      color: "Primary",
    },
    blockDroppingChildrenInside: true,
    children: [
      {
        id: nanoid(),
        name: "Icon",
        description: "Icon",
        props: {
          style: {
            width: "auto",
            height: "auto",
          },
          name: "IconSettings",
        },
        children: [],
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
