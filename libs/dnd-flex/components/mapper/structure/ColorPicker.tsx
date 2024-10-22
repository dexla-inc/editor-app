import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "ColorPicker",
    description: "Color Picker",
    props: {
      ...requiredModifiers.colorPicker,
      size: "sm",
      ...(props.props || {}),
    },
    onLoad: {
      children: { dataType: "static", static: "#ffffff" },
    },
  };
};
