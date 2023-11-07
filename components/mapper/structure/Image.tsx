import { defaultImageValues } from "@/components/modifiers/Image";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { style = {}, ...imageProps } = props.props || {};
  return {
    id: nanoid(),
    name: "Image",
    description: "Image",
    props: {
      style: {
        width: "120px",
        height: "120px",
        position: "relative",
        ...style,
      },
      ...defaultImageValues,
      ...(imageProps || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
