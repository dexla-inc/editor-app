import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "ButtonIcon",
    description: "ButtonIcon",
    props: {
      style: {
        width: "fit-content",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      variant: "filled",
      color: "Primary.6",
      size: "md",
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
          color: "PrimaryText.6",
        },
        children: [],
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
