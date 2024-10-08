import { getColorValue } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";
import { structureMapper } from "@/utils/componentMapper";
import { useThemeStore } from "@/stores/theme";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = useThemeStore.getState().theme;
  const radioItemContent = props.content ?? "New Radio Text";
  const radioItemTitle = props.title ?? "Radio Title";

  const title = structureMapper["Title"].structure({
    theme,
    props: { order: 6, children: radioItemTitle },
  });

  const defaultBorderColor = getColorValue(theme, "Border.6");
  const selectedBorderColor = getColorValue(theme, "Primary.6");
  const selectedBgColor = getColorValue(theme, "Primary.0");

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
          gap: "sm",
          style: {
            display: "flex",
            flexWrap: "nowrap",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            position: "relative",
            padding: "15px",
            width: "300px",
            height: "100%",
            minHeight: "30px",
            paddingTop: "15px",
            paddingBottom: "15px",
            paddingLeft: "15px",
            paddingRight: "15px",
            borderWidth: "1px",
            borderRadius: "8px",
            borderStyle: "solid",
            borderColor: defaultBorderColor,
            backgroundColor: "transparent",
          },
        },
        states: {
          checked: {
            style: {
              borderColor: selectedBorderColor,
              backgroundColor: selectedBgColor,
              borderWidth: "2px",
            },
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Container",
            description: "Radio Description",
            props: { gap: "xs", style: { flexDirection: "column" } },
            children: [
              title,
              {
                id: nanoid(),
                name: "Text",
                description: "Text",
                children: [],
                props: {
                  children: radioItemContent,
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
                width: "24px",
                height: "24px",
              },
            },
            blockDroppingChildrenInside: true,
            states: {
              checked: {
                name: "IconCircleDot",
                color: "Primary.6",
              },
            },
          },
        ],
      },
    ],
    blockDroppingChildrenInside: false,
  };
};
