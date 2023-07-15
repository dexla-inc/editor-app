import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

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
        marginTop: px(theme.spacing.xl),
        marginBottom: px(theme.spacing.xl),
        marginLeft: px(theme.spacing.xl),
        marginRight: px(theme.spacing.xl),
        backgroundColor: "white",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "NotImplement Stack Container",
        props: {
          style: {
            paddingTop: px(theme.spacing.lg),
            paddingBottom: px(theme.spacing.lg),
            width: "100%",
            height: "auto",
            display: "flex",
            jistifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
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
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
              },
            },
            blockDroppingChildrenInside: true,
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
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
