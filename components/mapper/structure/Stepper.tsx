import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";
import { defaultLayoutValues } from "@/components/modifiers/Layout";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const stepperId = nanoid();

  const stepperStructure = {
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
        description: "New Stepper",
        props: {
          activeStep: 0,
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
                      },
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Icon",
                        description: "Icon",
                        children: [],
                        props: {
                          name: "IconArrowNarrowRight",
                          width: "24px",
                        },
                        blockDroppingChildrenInside: true,
                      },
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        children: [],
                        props: {
                          children: "First Step",
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
                          children: "First Step content",
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
                                  stepperId,
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
              },
            ],
          },
          {
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
                      },
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Icon",
                        description: "Icon",
                        children: [],
                        props: {
                          name: "IconArrowNarrowRight",
                          width: "24px",
                        },
                        blockDroppingChildrenInside: true,
                      },
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        children: [],
                        props: {
                          children: "Second Step",
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
                          children: "Second Step content",
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
                              textColor: "Black.2",
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
                                  name: "changeStep",
                                  stepperId,
                                  control: "previous",
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
                                  name: "changeStep",
                                  stepperId,
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
              },
            ],
          },
          {
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
                      },
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Icon",
                        description: "Icon",
                        children: [],
                        props: {
                          name: "IconArrowNarrowRight",
                          width: "24px",
                        },
                        blockDroppingChildrenInside: true,
                      },
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        children: [],
                        props: {
                          children: "Third Step",
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
                          children: "Third Step content",
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
                              textColor: "Black.2",
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
                                  name: "changeStep",
                                  stepperId,
                                  control: "previous",
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
                                  name: "changeStep",
                                  stepperId,
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
              },
            ],
          },
        ],
      },
    ],
  };

  return stepperStructure as Component;
};
