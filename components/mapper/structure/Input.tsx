import { defaultInputValues } from "@/components/modifiers/Input";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { defaultTheme } from "@/components/IFrame";

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
          size: "md",
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
            flexDirection: "column",
          },
          ...defaultInputValues,
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
