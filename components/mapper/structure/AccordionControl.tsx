import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "AccordionControl",
    description: "Accordion Control",
    props: {
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Accordion Text",
        children: [],
        props: {
          children: "First Item Text",
          color: `${theme.colors.Black ? "Black.6" : "dark"}`,
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "fit-content",
            height: "fit-content",
          },
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
