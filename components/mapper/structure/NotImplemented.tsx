import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "auto"
  }`;

  return {
    id: nanoid(),
    name: "Container",
    description: "NotImplement Container",
    props: {
      style: {
        width: columnsToWidth,
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Stack",
        description: "NotImplement Stack",
        props: {
          align: "center",
          justify: "center",
          spacing: 2,
          style: {
            paddingTop: px(theme.spacing.lg),
            paddingBottom: px(theme.spacing.lg),
            width: "100%",
            height: "auto",
          },
          ...(props.props || {}),
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "NotImplement Component Name",
            children: [],
            props: {
              children: props.name,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.dark[6],
                width: "auto",
                height: "auto",
              },
            },
          },
          {
            id: nanoid(),
            name: "Text",
            description: "NotImplement Text",
            children: [],
            props: {
              children: "Not implemented yet",
              style: {
                fontSize: `${px(theme.fontSizes.xs)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.gray[5],
                width: "auto",
                height: "auto",
              },
            },
          },
        ],
      },
    ],
  };
};
