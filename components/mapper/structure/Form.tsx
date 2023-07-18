import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { style, ...rest } = props?.props || {};

  return {
    id: nanoid(),
    name: "Form",
    description: "Form",
    props: {
      style: {
        paddingTop: px(theme.spacing.sm),
        paddingBottom: px(theme.spacing.sm),
        paddingLeft: "0px",
        paddingRight: "0px",
        width: "400px",
        height: "auto",
        minHeight: "10px",
        flexDirection: "column",
        rowGap: "20px",
        columnGap: "20px",
        alignItems: "center",
        justifyContent: "center",
        ...(style || {}),
      },
      ...(rest || {}),
    },
  };
};
