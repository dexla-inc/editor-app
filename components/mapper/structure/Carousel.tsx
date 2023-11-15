import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { defaultImageValues } from "@/components/modifiers/Image";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Carousel",
    description: "Carousel",
    props: {
      style: {
        height: "200px",
        width: "100%,",
      },
      controlSize: "26px",
      controlsOffset: "md",
      initialSlide: 0,
      numberOfSlides: 3,
      orientation: "horizontal",
      align: "center",
    },
    children: [
      {
        id: nanoid(),
        name: "Image",
        description: "Carousel Slide",
        props: {
          style: {
            height: "200px",
            width: "100%,",
            position: "relative",
          },
          ...defaultImageValues,
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Image",
        description: "Carousel Slide",
        props: {
          style: {
            height: "200px",
            width: "100%,",
            position: "relative",
          },
          ...defaultImageValues,
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Image",
        description: "Carousel Slide",
        props: {
          style: {
            height: "200px",
            width: "100%,",
            position: "relative",
          },
          ...defaultImageValues,
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
    blockDroppingChildrenInside: true,
  };
};
