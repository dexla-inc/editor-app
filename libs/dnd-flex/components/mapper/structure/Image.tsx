import { defaultImageValues } from "@/components/modifiers/Image";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Image",
    description: "Image",
    onLoad: {
      src: {
        static:
          "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png",
        dataType: "static",
      },
      alt: {
        static: "",
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
