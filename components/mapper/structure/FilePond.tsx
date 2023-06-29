import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Container",
    description: "FilePond Container",
    props: {
      style: {
        paddingTop: px(theme.spacing.sm),
        paddingBottom: px(theme.spacing.sm),
        paddingLeft: px(theme.spacing.lg),
        paddingRight: px(theme.spacing.lg),
        width: "100%",
        height: "auto",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "FilePond",
        description: "FilePond",
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
            description: "FilePond Child Container",
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
                description: "FilePond Icon",
                children: [],
                props: {
                  name: "IconUpload",
                },
                blockDroppingChildrenInside: true,
              },
              {
                id: nanoid(),
                name: "Text",
                description: "FilePond Title",
                props: {
                  children: "FilePond",
                  color: `${theme.colors.Black ? "Black" : "dark"}`,
                  style: {
                    marginTop: px(theme.spacing.xs),
                    marginBottom: "2px",
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
                description: "FilePond Text",
                props: {
                  children: "Drag a file here",
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
      },
    ],
  };
};
