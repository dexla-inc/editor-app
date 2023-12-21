import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { order = 1 } = props.props || {};
  const { input: defaultInputValues, modal: defaultModalValues } =
    requiredModifiers;
  const size = theme.headings.sizes[`h5`];
  const modalId = nanoid();

  const defaultChildren = [
    {
      id: nanoid(),
      name: "Container",
      description: "Modal Header Container",
      props: {
        style: {
          width: "100%",
          backgroundColor: "white.6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      },
      children: [
        {
          id: nanoid(),
          name: "Title",
          description: "Title",
          props: {
            order,
            color: "Black.6",
            children: "Modal Title",
            style: {
              fontWeight: "bold",
              fontSize: size.fontSize,
              lineHeight: size.lineHeight,
              width: "auto",
              height: "auto",
            },
          },
          blockDroppingChildrenInside: true,
        },
        {
          id: nanoid(),
          name: "ButtonIcon",
          description: "ButtonIcon",
          props: {
            style: {
              width: "auto",
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          },
          blockDroppingChildrenInside: true,
          actions: [
            {
              id: nanoid(),
              trigger: "onClick",
              action: {
                name: "closeModal",
                modalId,
              },
            },
          ],
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
                name: "IconX",
                color: "Secondary.7",
              },
              children: [],
              blockDroppingChildrenInside: true,
            },
          ],
        },
      ],
    },
    {
      id: nanoid(),
      name: "Container",
      description: "Modal Container",
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
          description: "Name Modal Container",
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
      ],
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
          width: "fit-content",
          padding: px(theme.spacing.sm),
          alignSelf: "center",
        },
        textColor: "White.6",
        children: "Register",
      },
      blockDroppingChildrenInside: true,
    },
  ];

  return {
    id: modalId,
    name: "Modal",
    description: "Modal",
    props: {
      ...(props.props || {}),
      ...defaultModalValues,
      style: {
        padding: "0px",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Modal Container",
        props: {
          style: {
            gap: "10px",
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
          },
        },
        children: props.children ?? defaultChildren,
      },
    ],
  };
};
