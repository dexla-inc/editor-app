import { defaultTheme } from "@/components/IFrame";
import { defaultInputValues } from "@/components/modifiers/Input";
import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    props: {
      style: {
        ...defaultLayoutValues,
        width: "auto",
        height: "auto",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Text",
        children: [],
        props: {
          children: "A label",
          color: `${theme.colors.Black ? "Black.6" : "dark"}`,
          size: "sm",
          style: {
            width: "auto",
            height: "auto",
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Input",
        description: "Input",
        props: {
          style: {
            width: "100%",
            height: "auto",
            minWidth: "220px",
          },
          ...defaultInputValues,
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
