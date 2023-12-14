import { defaultTheme } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const title = structureMapper["Title"].structure({
    theme: theme,
  });
  const text = structureMapper["Text"].structure({
    theme: theme,
  });

  return {
    id: nanoid(),
    name: "Alert",
    description: "Alert",
    children: [
      {
        ...title,
        id: nanoid(),
        props: {
          order: 6,
          children: "Alert title",
        },
      },
      {
        ...text,
        id: nanoid(),
        props: {
          children: "Alert text",
        },
      },
    ],
    props: {
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
  };
};
