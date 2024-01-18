import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { name, style, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "FileButton",
    description: "Upload Files",
    props: {
      ...requiredModifiers.fileButton,
      name: name ?? "Upload button",
      ...(rest || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
