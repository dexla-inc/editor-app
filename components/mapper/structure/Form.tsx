import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
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
        paddingLeft: "0px",
        paddingRight: "0px",
        marginBottom: "0px",
        width: "100%",
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
