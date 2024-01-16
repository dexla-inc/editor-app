import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "FileUpload",
    description: "FileUpload",
    props: {
      style: {
        width: "100%",
        height: "auto",
        minHeight: "100px",
        backgroundColor: "white",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "FileUpload Child Container",
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
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "FileUpload Icon",
            children: [],
            props: {
              name: "IconUpload",
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "FileUpload Title",
            props: {
              children: "FileUpload",
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
                marginTop: px(theme.spacing.xs),
                marginBottom: "2px",
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "fit-content",
                height: "fit-content",
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "FileUpload Text",
            props: {
              children: "Drag a file here",
              style: {
                fontSize: `${px(theme.fontSizes.xs)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.gray[5],
                width: "fit-content",
                height: "fit-content",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
