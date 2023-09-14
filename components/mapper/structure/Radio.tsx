import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { defaultTheme } from "@/components/IFrame";
import { px } from "@mantine/core";

export const jsonStructure = (props?: any): Component => {
  const radioGroupId = nanoid();
  const theme = props.theme ?? defaultTheme;

  return {
    id: radioGroupId,
    name: "Radio",
    description: "Radio Group",
    props: {
      name: radioGroupId,
      label: "Select a radio",
      style: {
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "RadioItem",
        description: "Radio Item",
        props: {
          label: "Radio Label 1",
          value: "radio1",
          icon: "",
          style: {
            borderRadius: px(theme.radius.md),
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "RadioItem",
        description: "Radio Item",
        props: {
          label: "Radio Label 2",
          value: "radio2",
          icon: "",
          style: {
            borderRadius: px(theme.radius.md),
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
