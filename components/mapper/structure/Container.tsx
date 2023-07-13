import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  console.log(JSON.stringify(props.props));

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
        ...(props.props?.style || {}),
      },
      ...(props.props || {}),
    },
  };
};
