import { jsonStructure as checkboxItemStructure } from "@/components/mapper/structure/CheckboxItem";
import { jsonStructure as containerStructure } from "@/components/mapper/structure/Container";
import { jsonStructure as textStructure } from "@/components/mapper/structure/Text";
import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const checkboxGroupId = nanoid();
  const theme = props.theme ?? defaultTheme;
  const checkboxItemOne = checkboxItemStructure({
    theme,
    onLoad: { optionValue: { static: "option-1" } },
  });
  const textCheckboxItemOne = textStructure({
    props: { children: "Option 1" },
  });
  const containerCheckboxItemOne = containerStructure({
    children: [checkboxItemOne, textCheckboxItemOne],
  });
  const checkboxItemTwo = checkboxItemStructure({
    theme,
    onLoad: { optionValue: { static: "option-2" } },
  });
  const textCheckboxItemTwo = textStructure({
    props: { children: "Option 2" },
  });
  const containerCheckboxItemTwo = containerStructure({
    children: [checkboxItemTwo, textCheckboxItemTwo],
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
    children: [containerCheckboxItemOne, containerCheckboxItemTwo],
  };
};
