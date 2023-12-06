import { defaultTheme } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const text = structureMapper["Text"].structure({
    theme: theme,
  });

  return {
    id: nanoid(),
    name: "Alert",
    description: "Alert",
    children: [
      {
        ...text,
        id: nanoid(),
        props: {
          children: "Alert text",
        },
      },
    ],
    props: {
      title: "Alert",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
  };
};
