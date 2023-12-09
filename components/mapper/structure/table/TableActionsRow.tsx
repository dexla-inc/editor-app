import { defaultButtonValues } from "@/components/modifiers/Button";
import { defaultInputValues } from "@/components/modifiers/Input";
import { nanoid } from "nanoid";

// TODO: This needs export const jsonStructure = (props?: any): Component => {
export const tableHeader = {
  id: nanoid(),
  name: "Container",
  description: "Table Controls",
  blockDroppingChildrenInside: true,
  props: {
    style: {
      width: "100%",
      height: "auto",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: "20px",
    },
  },
  children: [
    {
      id: nanoid(),
      name: "Input",
      description: "Search Input",
      props: {
        ...defaultInputValues,
        style: { width: "300px", height: "auto" },
        icon: { props: { name: "IconSearch" } },
        placeholder: "Search",
      },
    },
    {
      id: nanoid(),
      name: "Container",
      description: "Table Actions",
      props: {
        style: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "20px",
          width: "auto",
        },
      },
      children: [
        {
          id: nanoid(),
          name: "Select",
          description: "Select",
          props: {
            style: {
              width: "150px",
            },
            data: [
              { label: "Action 1", value: "Action 1" },
              { label: "Action 2", value: "Action 2" },
              { label: "Action 3", value: "Action 3" },
            ],
            placeholder: "Actions",
          },
        },
        {
          id: nanoid(),
          name: "Button",
          description: "Button",
          props: {
            style: {
              ...defaultButtonValues,
            },
            color: "Primary.6",
            textColor: "PrimaryText.6",
            children: "Export CSV",
            leftIcon: "IconDownload",
          },
          blockDroppingChildrenInside: true,
        },
      ],
    },
  ],
};
