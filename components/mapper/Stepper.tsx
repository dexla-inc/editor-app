import { Component } from "@/utils/editor";
import { Stepper as MantineStepper, StepperProps, Text } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & StepperProps;

export const Stepper = ({ renderTree, component, ...props }: Props) => {
  const {
    activeStep,
    setActive,
    breakpoint,
    children,
    triggers,
    icon,
    ...componentProps
  } = component.props as any;

  const validatedActiveStep = Math.max(1, activeStep);

  const handleStepClick = (step: number) => {
    const newStep = Math.max(1, step);
    setActive(newStep);
  };

  return (
    <MantineStepper
      {...props}
      active={validatedActiveStep}
      onStepClick={handleStepClick}
      breakpoint={breakpoint}
      {...componentProps}
      {...triggers}
    >
      {component.children &&
        component.children.map((child: Component, index: number) => {
          if (child.name === "StepperStep") {
            return (
              <MantineStepper.Step
                key={index}
                label={child.props?.label}
                description={child.props?.description}
              >
                {child.children ? (
                  child.children.map((grandChild: Component) => {
                    return renderTree(grandChild);
                  })
                ) : (
                  <Text>Testing</Text>
                )}
              </MantineStepper.Step>
            );
          }
          return <Text key={index}>Testing</Text>;
        })}
    </MantineStepper>
  );
};
