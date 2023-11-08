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
    "Black.6",
    theme.defaultRadius,
  );
  console.log(cardStylingProps, theme.cardStyle);
  return {
    id: nanoid(),
    name: "Card",
    description: "Card",
    props: {
      ...(rest || {}),
      style: {
        ...defaultLayoutValues,
        width: "900px",
        height: "auto",
        minHeight: "100px",
        padding: theme.defaultSpacing,
        ...(style || {}),
        ...cardStylingProps,
      },
      bg: "White.6",
    },
  };
};
