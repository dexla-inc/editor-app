import { defaultImageValues } from "@/components/modifiers/Image";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Image",
    description: "Image",
    onLoad: {
      src: {
        value:
          "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png",
        dataType: "static",
      },
      alt: {
        value: "",
        dataType: "static",
      },
    },
    props: {
      style: {
        width: "120px",
        height: "120px",
        position: "relative",
      },
      ...defaultImageValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
