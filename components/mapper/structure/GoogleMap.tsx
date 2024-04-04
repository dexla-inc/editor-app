import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
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
      ...requiredModifiers.mapSettings,
      ...(props.props || {}),
    },
    onLoad: {
      centerLat: { static: 25.816347481537285, dataType: "static" },
      centerLng: { static: -80.1219500315037, dataType: "static" },
      zoom: { static: 15, dataType: "static" },
    },
    blockDroppingChildrenInside: true,
  };
};
