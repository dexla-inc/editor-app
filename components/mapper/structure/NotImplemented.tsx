import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "auto"
  }`;

  const style = props?.props?.style ?? {};

  return {
    id: nanoid(),
    name: "Container",
    description: "NotImplement Container",
    props: {
      w: columnsToWidth,
    },
    children: [
      {
        id: nanoid(),
        name: "Stack",
        description: "NotImplement Stack",
        props: {
          w: "100%",
          align: "center",
          justify: "center",
          spacing: 2,
          style: {
            paddingTop: px(theme.spacing.lg),
            paddingBottom: px(theme.spacing.lg),
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
                fontSize: theme.fontSizes.sm,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.dark[6],
                ...(style ?? {}),
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
                fontSize: theme.fontSizes.xs,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.gray[4],
                ...(style ?? {}),
              },
            },
          },
        ],
      },
    ],
  };
};
