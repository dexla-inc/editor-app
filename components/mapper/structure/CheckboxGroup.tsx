import { defaultTheme } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const checkboxGroupId = nanoid();
  const theme = props.theme ?? defaultTheme;
  const checkboxStructure = structureMapper["Checkbox"].structure;
  const checkboxItemOne = checkboxStructure({
    theme,
    optionValue: { static: "option-1" },
    children: "Option 1",
  });
  const checkboxItemTwo = checkboxStructure({
    theme,
    optionValue: { static: "option-2" },
    children: "Option 2",
  });

  return {
    id: checkboxGroupId,
    name: "CheckboxGroup",
    description: "Checkbox Group",
    props: {
      name: checkboxGroupId,
      style: {
        width: "fit-content",
        height: "fit-content",
        flexWrap: "nowrap",
        flexDirection: "column",
      },
      // TODO: Get size from branding
      size: "sm",
      ...(props.props || {}),
    },
    children: [checkboxItemOne, checkboxItemTwo],
  };
};
