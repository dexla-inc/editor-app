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

  const title = structureMapper()["Title"].structure({
    theme,
    props: {
      order: 6,
      children: radioItemTitle,
      style: { gridColumn: "3/9", gridRow: "1/3" },
    },
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
        gridColumn: "1/12",
        gridRow: "1/12",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: defaultBorderColor,
        backgroundColor: "transparent",
      },
      ...(props.props || {}),
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
      title,
      {
        id: nanoid(),
        name: "Text",
        description: "Text",
        children: [],
        props: {
          children: radioItemContent,
          color: "Black.6",
          style: {
            gridColumn: "1/12",
            gridRow: "4/8",
            lineHeight: "110%",
            letterSpacing: "0px",
            marginRight: "0px",
            marginBottom: "0px",
          },
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Icon",
        description: "Icon",
        children: [],
        props: {
          name: "IconCircle",
          color: "Border.6",
          style: {
            gridColumn: "1/3",
            gridRow: "1/3",
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
    blockDroppingChildrenInside: false,
  };
};
