import { defaultDrawerValues } from "@/components/modifiers/Drawer";
import { defaultInputValues } from "@/components/modifiers/Input";
import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
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
          backgroundColor: "white.6",
          flexDirection: "column",
          gap: "10px",
        },
      },
      children: [
        {
          id: nanoid(),
          name: "Container",
          description: "Name Table Container",
          props: {
            style: {
              width: "100%",
              backgroundColor: "white.6",
              gap: "10px",
            },
          },
          children: [
            {
              id: nanoid(),
              name: "Input",
              description: "Input",
              props: {
                style: {
                  width: "100%",
                },
                ...defaultInputValues,
                placeholder: "Your First Name",
                label: "First Name",
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
                },
                ...defaultInputValues,
                placeholder: "Your Last Name",
                label: "Last Name",
              },
              blockDroppingChildrenInside: true,
            },
          ],
        },
        {
          id: nanoid(),
          name: "Input",
          description: "Input",
          props: {
            style: {
              width: "100%",
            },
            ...defaultInputValues,
            placeholder: "Your Email",
            label: "Email",
            type: "email",
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
            },
            ...defaultInputValues,
            placeholder: "Password",
            label: "Password",
            type: "password",
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
            },
            ...defaultInputValues,
            placeholder: "Confirm Password",
            label: "Confirm Password",
            type: "password",
          },
          blockDroppingChildrenInside: true,
        },
        {
          id: nanoid(),
          name: "Checkbox",
          description: "Checkbox",
          props: {
            label: "I agree with the terms and conditions",
            style: {
              width: "100%",
            },
          },
          blockDroppingChildrenInside: true,
        },
        {
          id: nanoid(),
          name: "Container",
          description: "Actions Table Container",
          props: {
            style: {
              width: "100%",
              backgroundColor: "white.6",
              gap: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
          },
          children: [
            {
              id: nanoid(),
              name: "Link",
              description: "Link",
              props: {
                children: "Have an account? Login",
                color: `${theme.colors.Black ? "Black.6" : "dark"}`,
                style: {
                  fontSize: `${px(theme.fontSizes.sm)}px`,
                },
              },
              blockDroppingChildrenInside: true,
            },
            {
              id: nanoid(),
              name: "Button",
              description: "Button",
              props: {
                style: {
                  width: "auto",
                  padding: px(theme.spacing.sm),
                },
                textColor: "White.6",
                children: "Register",
              },
              blockDroppingChildrenInside: true,
            },
          ],
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
