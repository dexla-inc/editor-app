import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
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
      iconName: "IconSettings",
      iconColor: "PrimaryText.6",
      iconSize: "xs",
      ...(props ?? {}),
    },
    states: {
      hover: { color: "Primary.7" },
      disabled: {
        color: "Neutral.6",
        iconColor: "Neutral.9",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
