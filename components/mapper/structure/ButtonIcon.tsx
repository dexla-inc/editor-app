import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "ButtonIcon",
    description: "ButtonIcon",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
      },
      variant: "filled",
      color: "Primary.6",
      size: "md",
      iconProps: {
        style: {
          width: "auto",
          height: "auto",
        },
        name: "IconSettings",
        color: "PrimaryText.6",
        size: "xs",
      },
    },
    states: {
      hover: { color: "Primary.7" },
      disabled: {
        color: "Secondary.6",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
