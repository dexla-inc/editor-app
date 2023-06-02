import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => ({
  id: nanoid(),
  name: "Container",
  columns: props.columns || 12,
  description: "AppBar Root",
  children: [
    {
      id: nanoid(),
      name: "Group",
      description: "AppBar Wrapper Group",
      columns: 12,
      props: {
        position: "apart",
        w: "100%",
        style: {
          borderBottom: `1px solid ${theme.colors.gray[3]}`,
        },
        py: "sm",
        px: "lg",
      },
      children: [
        {
          id: nanoid(),
          name: "Text",
          columns: 0,
          description: "App Name",
          children: [],
          props: {
            children: "My Company",
            size: "xs",
          },
        },
        {
          id: nanoid(),
          name: "Avatar",
          columns: 0,
          description: "Avatar",
          children: [],
          props: {
            color: "blue",
            radius: "xl",
          },
        },
      ],
    },
  ],
});
