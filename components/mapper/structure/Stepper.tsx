import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const stepperId = nanoid();
  console.log(stepperId);
  return {
    id: nanoid(),
    name: "Container",
    description: "Stepper Container",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        minHeight: "100px",
        width: "100%",
      },
    },
    children: [
      {
        id: stepperId,
        name: "Stepper",
        description: "Stepper",
        props: {
          activeStep: 1,
          breakpoint: "sm",
          style: {
            width: "100%",
          },
          ...(props.props || {}),
        },
        children: [
          {
            id: nanoid(),
            name: "StepperStep",
            description: "StepperStep",
            props: {
              label: "First step",
              description: "Step description",
            },
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Container",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "row",
                    minHeight: "100px",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Text",
                    children: [],
                    props: {
                      children: "Build your step and move your components here",
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
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "StepperStep",
            description: "StepperStep",
            props: {
              label: "Second step",
              description: "Step description",
            },
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Container",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "row",
                    minHeight: "100px",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Text",
                    children: [],
                    props: {
                      children: "Build your step and move your components here",
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
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "StepperStep",
            description: "StepperStep",
            props: {
              label: "Third step",
              description: "Step description",
            },
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Container",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "row",
                    minHeight: "100px",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Text",
                    children: [],
                    props: {
                      children: "Build your step and move your components here",
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
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "StepperStep",
            description: "StepperStep",
            props: {
              label: "Fourth step",
              description: "Step description",
            },
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Container",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "row",
                    minHeight: "100px",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Text",
                    children: [],
                    props: {
                      children: "Build your step and move your components here",
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
                ],
              },
            ],
          },
        ],
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
              variant: "default",
              children: "Previous",
              leftIcon: "IconArrowLeft",
            },
            blockDroppingChildrenInside: true,
            actions: [
              {
                id: nanoid(),
                trigger: "onClick",
                action: {
                  name: "previousStep",
                  stepperId: stepperId,
                  activeStep: 1,
                },
              },
            ],
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
                  name: "nextStep",
                  stepperId: stepperId,
                  activeStep: 1,
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
