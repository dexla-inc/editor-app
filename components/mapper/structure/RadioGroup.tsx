import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const radioGroupId = nanoid();

  return {
    id: radioGroupId,
    name: "RadioGroup",
    description: "Radio Group",
    props: {
      name: radioGroupId,
      style: {
        width: "100%",
        height: "auto",
      },
      children: [
        {
          id: nanoid(),
          name: "Radio",
          description: "Radio",
          data: [
            { key: 1, value: "Carbon" },
            { key: 2, value: "Nitrogen" },
            { key: 3, value: "Yttrium" },
          ],
          blockDroppingChildrenInside: true,
          ...(props.props || {}),
        },
      ],
    },
  };
};
