import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const title = props.props?.title ?? "Authentication";

  const defaultChildren = [
    {
      id: nanoid(),
      name: "Container",
      description: "Container for the modal",
      children: [
        {
          id: nanoid(),
          name: "Text",
          description: "Text",
          props: {
            children: "Please enter your information",
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
        {
          id: nanoid(),
          name: "Input",
          description: "Input",
          props: {
            style: {
              width: "100%",
              height: "auto",
            },
            placeholder: "Username",
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
            },
            placeholder: "Password",
            type: "password",
          },
          blockDroppingChildrenInside: true,
        },
        {
          id: nanoid(),
          name: "Button",
          description: "Button",
          props: {
            style: {
              width: "100%",
              height: "auto",
              backgroundColor: theme.colors.primary,
              color: "white",
            },
            children: "Submit",
          },
          blockDroppingChildrenInside: true,
        },
      ],
    },
  ];

  return {
    id: nanoid(),
    name: "Modal",
    description: "Modal",
    props: {
      title: title,
      ...(props.props || {}),
    },
    children: props.children ?? defaultChildren,
  };
};
