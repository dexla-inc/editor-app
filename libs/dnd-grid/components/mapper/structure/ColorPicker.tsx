import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { colorPicker: colorPickerValues } = requiredModifiers;
  return {
    id: nanoid(),
    name: "ColorPicker",
    description: "Color Picker",
    props: {
      ...colorPickerValues,
      ...(props.props || {}),
    },
    onLoad: {
      children: { dataType: "static", static: "#ffffff" },
    },
  };
};
