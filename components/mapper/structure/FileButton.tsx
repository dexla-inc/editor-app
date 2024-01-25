import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { name, style, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "FileButton",
    description: "Upload Files",
    onLoad: {
      name: {
        dataType: "static",
        value: name ?? "Upload button",
      },
    },
    props: {
      ...requiredModifiers.fileButton,
      ...(rest || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
