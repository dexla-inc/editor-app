import { useThemeStore } from "@/stores/theme";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { MantineSize, px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = useThemeStore.getState().theme;
  const setSize = (size: MantineSize) => `${px(theme.spacing[size])}px`;

  return {
    id: nanoid(),
    name: "FileUpload",
    description: "FileUpload",
    props: {
      style: {
        gridColumn: "1/30",
        gridRow: "1/10",
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
          gap: "xs",
          style: {
            paddingTop: setSize("lg"),
            paddingBottom: setSize("lg"),
            gridColumn: "1/30",
            gridRow: "1/10",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "FileUpload Icon",
            children: [],
            props: {
              ...requiredModifiers.icon,
              name: "IconUpload",
              style: {
                gridColumn: "10/12",
                gridRow: "2/4",
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "FileUpload Title",
            props: {
              children: "FileUpload",
              color: "Black.6",
              style: {
                fontSize: setSize("sm"),
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                gridColumn: "10/12",
                gridRow: "5/7",
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
                fontSize: setSize("xs"),
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.gray[5],
                gridColumn: "10/12",
                gridRow: "8/10",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
