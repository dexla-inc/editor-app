import { jsonStructure as radioItemStructure } from "@/components/mapper/structure/RadioItem";
import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const radioGroupId = nanoid();
  const theme = props.theme ?? defaultTheme;
  const radioItemOne = radioItemStructure({
    theme,
    label: "New Radio Item 1",
    props: { value: "change-me-1" },
  });
  const radioItemTwo = radioItemStructure({
    theme,
    label: "New Radio Item 2",
    props: { value: "change-me-2" },
  });

  return {
    id: radioGroupId,
    name: "Radio",
    description: "Radio Group",
    props: {
      name: radioGroupId,
      style: {
        width: "fit-content",
        height: "fit-content",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        ...radioItemOne,
      },
      {
        id: nanoid(),
        ...radioItemTwo,
      },
    ],
  };
};
