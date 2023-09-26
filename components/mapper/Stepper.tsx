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
    (state) => state.updateTreeComponent,
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

  const header = component.children?.find(
    (child) => child.name === "StepperHeader",
  );
  const steppers = component.children?.find(
    (child) => child.name === "StepperContent",
  );

  return (
    <MantineStepper
      {...props}
      active={active}
      onStepClick={handleStepClick}
      breakpoint={breakpoint}
      {...componentProps}
      {...triggers}
      styles={{
        stepIcon: { display: "none" },
        separator: { display: "none" },
        step: { width: `calc(100% / ${steppers?.children?.length})` },
        stepBody: { width: "100%", marginLeft: 0 },
      }}
    >
      {steppers?.children &&
        steppers.children.map((child: Component, index: number) => {
          return (
            <MantineStepper.Step
              key={index}
              label={header?.children && renderTree(header.children[index])}
              icon={<></>}
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
