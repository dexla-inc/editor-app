import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { defaultTheme } from "@/utils/branding";
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
        alignItems: "center",
        width: "fit-content",
        height: "fit-content",
        flexDirection: "row",
        columnGap: "10px",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Switch",
        description: "Switch",
        props: {
          style: {
            width: "fit-content",
            height: "fit-content",
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
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
            width: "fit-content",
            height: "fit-content",
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
