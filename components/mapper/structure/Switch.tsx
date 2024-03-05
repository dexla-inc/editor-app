import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = props.theme ?? defaultTheme;
  const defaultLayoutValues = requiredModifiers.layout;

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
