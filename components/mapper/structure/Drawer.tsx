import { defaultTheme } from "@/components/IFrame";
import { defaultDrawerValues } from "@/components/modifiers/Drawer";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  const defaultChildren = [
    {
      id: nanoid(),
      name: "Container",
      description: "Table Container",
      props: {
        style: {
          width: "100%",
          height: "300px",
          backgroundColor: "white.6",
        },
      },
      children: [
        {
          id: nanoid(),
          name: "Text",
          description: "Text",
          props: {
            children: "Drawer content",
            color: `${theme.colors.Black ? "Black.6" : "dark"}`,
            style: {
              fontSize: "16px",
              fontWeight: "normal",
              lineHeight: "110%",
              letterSpacing: "0px",
              width: "auto",
              height: "auto",
            },
          },
          blockDroppingChildrenInside: true,
        },
      ],
    },
  ];

  return {
    id: nanoid(),
    name: "Drawer",
    description: "Drawer",
    props: {
      ...(props.props || {}),
      ...defaultDrawerValues,
    },
    children: props.children ?? defaultChildren,
  };
};
