import { nanoid } from "nanoid";
import { ComponentStructure } from "./components";
// import { MULTIPLIER } from "./constants";

export type ComponentType = {
  id: string;
  type: ComponentTypeName;
  label: string;
  blockDroppingChildrenInside: boolean;
  children?: ComponentType[];
  props: {
    bg: string;
    textColor: string;
    style: {
      gridColumn: string;
      gridRow: string;
    };
  };
};

export type ComponentTypeName = "button" | "container" | "text";

export type ResizeType = "right" | "bottom" | "bottom-right";

export const componentTypes: ComponentStructure[] = [
  {
    id: nanoid(),
    name: "button",
    description: "Button",
    blockDroppingChildrenInside: true,
    props: {
      bg: "bg-blue-500",
      textColor: "text-white",
      style: {
        gridColumn: "1/12",
        gridRow: "1/5",
      },
    },
  },
  {
    id: nanoid(),
    name: "container",
    description: "Container",
    blockDroppingChildrenInside: false,
    props: {
      bg: "bg-gray-100",
      textColor: "text-black",
      style: {
        gridColumn: "1/30",
        gridRow: "1/10",
      },
    },
  },
  {
    id: nanoid(),
    name: "text",
    description: "Text",
    blockDroppingChildrenInside: true,
    props: {
      bg: "bg-white",
      textColor: "text-black",
      style: {
        gridColumn: "1/6",
        gridRow: "1/3",
      },
    },
  },
];
