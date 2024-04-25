import { jsonStructure as checkboxItemStructure } from "@/components/mapper/structure/CheckboxItem";
import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const checkboxGroupId = nanoid();
  const theme = props.theme ?? defaultTheme;
  const checkboxItemOne = checkboxItemStructure({
    theme,
    children: "Option 1",
    props: { value: "option-1" },
  });
  const checkboxItemTwo = checkboxItemStructure({
    theme,
    children: "Option 2",
    props: { value: "option-2" },
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
      // dataType: "static",
      // data: [
      //   { label: "Option 1", value: "option-1" },
      //   { label: "Option 2", value: "option-2" },
      // ],
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        ...checkboxItemOne,
      },
      {
        id: nanoid(),
        ...checkboxItemTwo,
      },
    ],
  };
};
