import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  // TODO: Each row container should have padding. Does this mean we need to implement a Section?
  //       Row containers should direct horizontally
  // TODO: Form container shouldn't and any other container of that matter
  //       Form container should direct vertically

  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    props: {
      style: {
        paddingTop: px(theme.spacing.sm),
        paddingBottom: px(theme.spacing.sm),
        paddingLeft: px(theme.spacing.lg),
        paddingRight: px(theme.spacing.lg),
        width: "100%",
        height: "auto",
        minHeight: "50px",
      },
      ...(props.props || {}),
    },
  };
};
