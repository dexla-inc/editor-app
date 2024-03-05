import { structureMapper } from "@/utils/componentMapper";
import { Component, ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const stepperId = nanoid();

  const defaultButton = structureMapper["Button"].structure({});

  const stepperStructure = {
    id: nanoid(),
    name: "Container",
    description: "Stepper Container",
    props: {
      bg: "White.6",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        paddingRight: "20px",
        padding: "20px",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
      },
    },
    children: [
      {
        id: stepperId,
        name: "Stepper",
        description: "New Stepper",
        props: {
          ...requiredModifiers.stepper,
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
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        rowGap: "5px",
                        columnGap: "20px",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        position: "relative",
                        height: "auto",
                      },
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        children: [],
                        props: {
                          children: "Address",
                          color: "Black.6",
                          style: {
                            fontSize: "14px",
                            fontWeight: "normal",
                            lineHeight: "110%",
                            letterSpacing: "0px",
                            width: "auto",
                            height: "auto",
                          },
                          size: "sm",
                          weight: "normal",
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
                          color: "Neutral.7",
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
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        rowGap: "20px",
                        columnGap: "20px",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
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
                        name: "Container",
                        description: "Container",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: "20px",
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
                                padding: 12,
                              },
                              styles: {
                                label: {
                                  color: "rgba(179, 179, 179, 1)",
                                },
                              },
                              textColor: "Black.2",
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
                                padding: 12,
                              },
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
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        rowGap: "5px",
                        columnGap: "20px",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        position: "relative",
                        padding: "3px",
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        paddingLeft: "3px",
                        paddingRight: "3px",
                      },
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        children: [],
                        props: {
                          children: "Asset Description",
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
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        rowGap: "20px",
                        columnGap: "20px",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
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
                        name: "Container",
                        description: "Container",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: "20px",
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
                                padding: 12,
                              },
                              textColor: "Black.9",
                              variant: "default",
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
                            ...defaultButton,
                            props: {
                              children: "Next",
                              style: {
                                width: "auto",
                                height: "auto",
                                padding: 12,
                              },
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
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        rowGap: "5px",
                        columnGap: "20px",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        position: "relative",
                      },
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        children: [],
                        props: {
                          children: "Additional Information",
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
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        rowGap: "20px",
                        columnGap: "20px",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
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
                        name: "Container",
                        description: "Container",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: "20px",
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
                                padding: 12,
                              },
                              textColor: "Black.9",
                              variant: "default",
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
                            ...defaultButton,
                            props: {
                              children: "Next",
                              style: {
                                width: "auto",
                                height: "auto",
                                padding: 12,
                              },
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
