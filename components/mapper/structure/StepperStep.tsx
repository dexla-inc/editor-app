import { defaultTheme } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const defaultButton = structureMapper["Button"].structure({});
  const defaultLayoutValues = requiredModifiers.layout;

  return {
    id: nanoid(),
    name: "StepperStep",
    description: "StepperStep",
    children: [
      {
        id: nanoid(),
        name: "StepperStepHeader",
        description: "StepperStepHeader",
        children: [
          {
            id: nanoid(),
            name: "Container",
            description: "Container",
            props: {
              style: {
                ...defaultLayoutValues,
                flexDirection: "column",
                padding: "3px",
                paddingTop: "3px",
                paddingBottom: "3px",
                paddingLeft: "3px",
                paddingRight: "3px",
                rowGap: "5px",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Text",
                description: "Text",
                children: [],
                props: {
                  children: "New Step",
                  color: "Black.6",
                  style: {
                    fontSize: "14px",
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
                name: "Divider",
                description: "Divider",
                props: {
                  style: {
                    width: "100%",
                    height: "auto",
                  },
                  size: "lg",
                },
                blockDroppingChildrenInside: true,
                states: {
                  Active: {
                    color: "Success.5",
                  },
                  Complete: {
                    color: "Success.5",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        id: nanoid(),
        name: "StepperStepContent",
        description: "StepperStepContent",
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
                    ...defaultButton,
                    props: {
                      children: "Previous",
                      style: {
                        width: "auto",
                        height: "auto",
                        padding: px(theme.spacing.sm),
                      },
                      textColor: "Black.9",
                      variant: "default",
                      leftIcon: "IconArrowLeft",
                    },
                    blockDroppingChildrenInside: true,
                  },
                  {
                    id: nanoid(),
                    ...defaultButton,
                    props: {
                      children: "Next",
                      style: {
                        width: "auto",
                        height: "auto",
                        padding: px(theme.spacing.sm),
                      },
                      rightIcon: "IconArrowRight",
                    },
                    blockDroppingChildrenInside: true,
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
