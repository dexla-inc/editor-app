import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "CheckboxItem",
    description: "Checkbox Item",
    props: {
      style: {
        width: "fit-content",
        height: "fit-content",
      },
      // TODO: Get size from branding
      size: "sm",
      ...(props.props || {}),
    },
    onLoad: {
      value: {
        static: props.value,
        dataType: "static",
      },
    },
    states: { disabled: { bg: "Neutral.7", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Container",
        props: {
          gap: "xs",
          style: { flexDirection: "column" },
          ...(props.props || {}),
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: props?.children ?? "Option 1",
              color: "Black.6",
              size: "sm",
              style: {
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
                marginRight: "0px",
                marginBottom: "0px",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
