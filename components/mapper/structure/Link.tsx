import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Container",
    description: "Link Container",
    props: {
      style: {
        marginTop: px(theme.spacing.xl),
        marginBottom: px(theme.spacing.xl),
        marginLeft: px(theme.spacing.xl),
        marginRight: px(theme.spacing.xl),
        width: "100%",
        height: "auto",
        minHeight: "auto",
        backgroundColor: "white",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Link",
        description: "Link",
        props: {
          style: {
            width: "auto",
            height: "auto",
          },
          ...(props.props || {}),
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "Link Text",
            children: [],
            props: {
              children: "New Link",
              color: "Primary",
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
              },
              ...(props.props || {}),
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
