import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Container",
    description: "Alert Container",
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
        name: "Alert",
        description: "Alert",
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "AlertText",
            children: [],
            props: {
              children: "Alert text",
              color: `${theme.colors.Black ? "Black" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                heigh: "auto",
              },
              ...(props.props || {}),
            },
            blockDroppingChildrenInside: true,
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
      },
    ],
  };
};
