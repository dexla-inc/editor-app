import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "NavLink",
    description: "Nav Link",
    onLoad: {
      label: {
        value: "Nav Link",
        dataType: "static",
      },
    },
    props: {
      icon: "IconLayoutDashboard",
      style: {
        ...requiredModifiers.navLink,
      },
      ...(props.props || {}),
    },
    states: {
      disabled: {
        bg: "Secondary.1",
        color: "PrimaryText.9",
        iconColor: "PrimaryText.9",
      },
    },
  };
};
