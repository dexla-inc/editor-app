import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "GoogleMap",
    description: "GoogleMap",
    children: [],
    props: {
      style: {
        width: "100%",
        height: "500px",
      },
      center: {
        lat: 0,
        lng: 0,
      },
      language: "en",
      zoom: 10,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
