import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Textarea",
    description: "Textarea",
    props: {
      placeholder: "Textarea",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [],
  };
};
