import { defaultPopOverValues } from "@/components/modifiers/PopOver";
import { useThemeStore } from "@/stores/theme";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = useThemeStore.getState().theme;
  return {
    id: nanoid(),
    name: "PopOver",
    description: "PopOver",
    props: {
      ...(props.props || {}),
      ...requiredModifiers.popOver,
      style: {
        padding: "10px",
        width: "fit-content",
        maxWidth: "fit-content",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Container",
        props: {
          style: {
            width: "auto",
            backgroundColor: "white.6",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: "This is a PopOver",
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
              },
              ...(props.props || {}),
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
