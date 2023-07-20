import { defaultTheme } from "@/components/IFrame";
import { defaultImageValues } from "@/components/modifiers/Image";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Image",
    description: "Image",
    props: {
      withPlaceholder: true,
      style: {
        width: "200px",
        height: "150px",
        ...defaultImageValues,
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
