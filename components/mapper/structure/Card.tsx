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
    theme.cardStyle ?? "ROUNDED",
    theme.colors["Border"][6],
    theme.defaultRadius,
  );

  return {
    id: nanoid(),
    name: "Card",
    description: "Card",
    props: {
      ...(rest || {}),
      style: {
        ...defaultLayoutValues,
        width: "auto",
        height: "auto",
        minHeight: "100px",
        padding: "20px",
        ...(style || {}),
        ...cardStylingProps,
      },
      bg: "White.6",
    },
  };
};
