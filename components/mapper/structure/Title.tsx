import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";
import merge from "lodash.merge";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { order = 1, ...rest } = props.props || {};
  const size = theme.headings.sizes[`h${order}`];

  const defaultValues = requiredModifiers.text;

  return {
    id: nanoid(),
    name: "Title",
    description: "Title",
    children: [],
    onLoad: {
      children: {
        value: "New Title",
        dataType: "static",
      },
    },
    props: merge({}, defaultValues, {
      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
      order: order,
      style: {
        fontSize: size.fontSize,
        fontWeight: size.fontWeight,
        lineHeight: size.lineHeight,
      },
      ...(rest || {}),
    }),
    blockDroppingChildrenInside: true,
  };
};
