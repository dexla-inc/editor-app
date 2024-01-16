import { getCardStyling } from "@/components/CardStyleSelector";
import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { style, ...rest } = props?.props || {};
  // get theme card style
  const theme = useEditorStore.getState().theme;
  const cardStylingProps = getCardStyling(
    theme.cardStyle ?? "OUTLINED_ROUNDED",
    theme.colors["Border"][6],
    theme.defaultRadius,
  );

  return {
    id: nanoid(),
    name: "UnstyledButton",
    description: "Unstyled Button",
    props: {
      ...(rest || {}),
      style: {
        ...defaultLayoutValues,
        width: "fit-content",
        height: "fit-content",
        minHeight: "100px",
        padding: "20px",
        flex: "1 0 auto",
        ...(style || {}),
        ...cardStylingProps,
      },
      bg: "White.6",
    },
  };
};
