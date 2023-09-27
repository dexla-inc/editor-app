import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { px } from "@mantine/core";
import { defaultTheme } from "@/components/IFrame";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "StepperStep",
    description: "StepperStep",
    props: { style: { ...defaultLayoutValues } },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Container",
        props: {
          style: {
            ...defaultLayoutValues,
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: "New Step content",
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
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
            name: "Container",
            description: "Container",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "20px",
                minHeight: "100px",
                width: "100%",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Button",
                description: "Button",
                props: {
                  style: {
                    width: "auto",
                    height: "auto",
                    padding: px(theme.spacing.sm),
                  },
                  styles: {
                    label: {
                      color: "rgba(179, 179, 179, 1)",
                    },
                  },
                  textColor: "Black.2",
                  variant: "default",
                  children: "Previous",
                  leftIcon: "IconArrowLeft",
                },
                blockDroppingChildrenInside: true,
              },
              {
                id: nanoid(),
                name: "Button",
                description: "Button",
                props: {
                  style: {
                    width: "auto",
                    height: "auto",
                    padding: px(theme.spacing.sm),
                  },
                  children: "Next",
                  rightIcon: "IconArrowRight",
                },
                blockDroppingChildrenInside: true,
                actions: [
                  {
                    id: nanoid(),
                    trigger: "onClick",
                    action: {
                      name: "changeStep",
                      stepperId: "",
                      control: "next",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};
