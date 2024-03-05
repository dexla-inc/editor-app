import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { MantineSize, px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = props.theme ?? defaultTheme;
  const setSize = (size: MantineSize) => `${px(theme.spacing[size])}px`;

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
          gap: "xs",
          style: {
            paddingTop: setSize("lg"),
            paddingBottom: setSize("lg"),
            width: "100%",
            height: "100%",
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
              ...requiredModifiers.icon,
              name: "IconUpload",
              size: "xs",
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
                fontSize: setSize("sm"),
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
                fontSize: setSize("xs"),
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
