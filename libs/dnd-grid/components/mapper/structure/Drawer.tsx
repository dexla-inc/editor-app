import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { input: defaultInputValues, drawer: defaultDrawerValues } =
    requiredModifiers;

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
    children: [
      {
        id: nanoid(),
        name: "Input",
        description: "Input",
        props: {
          style: {
            width: "auto",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "1 / 96",
            gridRow: "1 / 5",
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
            width: "auto",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "1 / 96",
            gridRow: "6 / 10",
          },
          ...defaultInputValues,
          placeholder: "Your Last Name",
          label: "Last Name",
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Button",
        description: "Button",
        props: {
          children: "Register",
          style: {
            width: "auto",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "40 / 58",
            gridRow: "15 / 19",
          },
          textColor: "White.6",
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
