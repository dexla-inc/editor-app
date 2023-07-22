import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { value, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "ButtonIcon",
    description: "Button with icon only",
    props: {
      style: {
        width: "auto",
        height: "auto",
        paddingTop: "50%",
        paddingBottom: "50%",
        paddingLeft: "50%",
        paddingRight: "50%",
      },
      ...(rest || {}),
      blockDroppingChildrenInside: true,
      children: [
        {
          id: nanoid(),
          name: "Icon",
          description: "Icon",
          props: {
            style: {
              width: "auto",
              height: "auto",
            },
            name: "IconSettings",
          },
          children: [],
          blockDroppingChildrenInside: true,
        },
      ],
    },
  };
};
