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
        gridColumn: "1/12",
        gridRow: "1/6",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
