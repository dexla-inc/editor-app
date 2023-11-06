import { defaultSelectValues } from "@/components/modifiers/Select";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { defaultTheme } from "@/components/IFrame";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { ...defaultValues } = defaultSelectValues;

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
          weight: "normal",
          style: {
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "auto",
            height: "auto",
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Select",
        description: "Select",
        props: {
          style: {
            width: "auto",
            height: "auto",
          },
          ...defaultValues,
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
