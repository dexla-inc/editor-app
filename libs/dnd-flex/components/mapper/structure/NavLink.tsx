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
        static: "Nav Link",
        dataType: "static",
      },
    },
    props: {
      icon: "IconLayoutDashboard",
      style: {
        ...requiredModifiers.navLink,
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
    states: {
      disabled: {
        bg: "Neutral.6",
        color: "Neutral.9",
        iconColor: "Neutral.9",
      },
    },
  };
};
