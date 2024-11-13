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
      style: {
        gridColumn: "1/4",
        gridRow: "1/4",
      },
    },
    onLoad: {
      children: { dataType: "static", static: "#ffffff" },
    },
  };
};
