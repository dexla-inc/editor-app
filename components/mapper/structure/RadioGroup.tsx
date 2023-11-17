import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const radioGroupId = nanoid();
  const theme = props.theme ?? defaultTheme;

  return {
    id: radioGroupId,
    name: "Radio",
    description: "Radio Group",
    props: {
      name: radioGroupId,
      style: {
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "RadioItem",
        description: "Radio Item",
        props: {
          value: "change-me-1",
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
                  children: "New Radio Item 1",
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
      },
      {
        id: nanoid(),
        name: "RadioItem",
        description: "Radio Item",
        props: {
          value: "change-me-2",
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
                  children: "New Radio Item 2",
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
      },
    ],
  };
};
