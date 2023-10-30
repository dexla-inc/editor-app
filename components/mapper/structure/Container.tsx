import { defaultTheme } from "@/components/IFrame";
import { defaultBorderValues } from "@/components/modifiers/Border";
import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { style, ...rest } = props?.props || {};

  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    props: {
      ...(rest || {}),
      style: {
        ...defaultLayoutValues,
        ...defaultBorderValues,
        width: "100%",
        height: "auto",
        minHeight: "50px",
        ...(style || {}),
      },
    },
  };
};
