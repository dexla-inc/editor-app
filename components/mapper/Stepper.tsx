import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { Stepper as MantineStepper, StepperProps } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & StepperProps;

export const Stepper = ({ renderTree, component, ...props }: Props) => {
  const {
    activeStep,
    breakpoint,
    children,
    triggers,
    icon,
    ...componentProps
  } = component.props as any;

  const [active, setActive] = useState(activeStep ?? 1);

  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  useEffect(() => {
    // Reflect any external changes to the activeStep property
    if (activeStep !== undefined && activeStep !== active) {
      setActive(activeStep);
    }
  }, [activeStep, active]);

  const handleStepClick = (stepIndex: number) => {
    setActive(stepIndex);
    updateTreeComponent(component.id!, { activeStep: stepIndex }, false);
  };

  return (
    <MantineStepper
      {...props}
      active={active}
      onStepClick={handleStepClick}
      breakpoint={breakpoint}
      {...componentProps}
      {...triggers}
    >
      {component.children &&
        component.children.map((child: Component, index: number) => {
          return (
            <MantineStepper.Step
              key={index}
              label={child.props?.label}
              description={child.props?.description}
            >
              {child.children &&
                child.children.map((grandChild: Component) => {
                  return renderTree(grandChild);
                })}
            </MantineStepper.Step>
          );
        })}
    </MantineStepper>
  );
};
