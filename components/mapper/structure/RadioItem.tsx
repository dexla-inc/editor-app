import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { px } from "@mantine/core";
import { defaultTheme } from "@/components/IFrame";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "RadioItem",
    description: "Radio Item",
    props: {
      value: "change-me",
      style: {
        borderRadius: px(theme.radius.md),
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Container",
        props: {
          style: {
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            rowGap: "10px",
            columnGap: "20px",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "15px",
            width: "auto",
            height: "auto",
            minHeight: "30px",
            paddingTop: "15px",
            paddingBottom: "15px",
            paddingLeft: "15px",
            paddingRight: "15px",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "Icon",
            children: [],
            props: {
              name: "IconCircle",
              width: "24px",
              style: {
                position: "relative",
                width: "26px",
                height: "26px",
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: "New Radio Item",
              color: "Black.6",
              size: "sm",
              style: {
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
                marginRight: "0px",
                marginBottom: "0px",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
    blockDroppingChildrenInside: false,
  };
};
