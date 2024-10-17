import { structureMapper } from "@/libs/dnd-grid/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { input: defaultInputValues, drawer: defaultDrawerValues } =
    requiredModifiers;

  const defaultButton = structureMapper["Button"].structure({});

  const defaultChildren = [
    {
      id: nanoid(),
      name: "Container",
      description: "Container",
      props: {
        gap: "lg",
        style: {
          width: "100%",
          backgroundColor: "white.6",
          flexDirection: "column",
          padding: "20px",
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
                color: "Black.6",
              },
              blockDroppingChildrenInside: true,
            },
            {
              id: nanoid(),
              ...defaultButton,
              props: {
                children: "Register",
                textColor: "White.6",
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
    onLoad: {
      isVisible: {
        dataType: "static",
        static: true,
      },
      showInEditor: {
        dataType: "static",
        static: true,
      },
    },
    children: props.children ?? defaultChildren,
  };
};
