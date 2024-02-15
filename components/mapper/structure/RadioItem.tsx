import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const label = props.label ?? "New Radio Item";

  return {
    id: nanoid(),
    name: "RadioItem",
    description: "Radio Item",
    props: {
      value: "change-me",
      style: {
        borderRadius: `${px(theme.radius.md)}px`,
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
              color: "Border.6",
              style: {
                position: "relative",
                width: "26px",
                height: "26px",
              },
            },
            blockDroppingChildrenInside: true,
            states: {
              checked: {
                name: "IconCircleDot",
              },
            },
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: label,
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
