import { useThemeStore } from "@/stores/theme";
import { structureMapper } from "@/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";
import merge from "lodash.merge";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = useThemeStore.getState().theme;
  const checkboxGroupId = nanoid();
  const checkboxStructure = structureMapper()["Checkbox"].structure;
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
        gridColumn: "1/16",
        gridRow: "1/4",
      },
      ...(props.props || {}),
    },
    children: [
      merge(checkboxItemOne, { props: { style: {} } }),
      merge(checkboxItemTwo, { props: { style: {} } }),
    ],
  };
};
