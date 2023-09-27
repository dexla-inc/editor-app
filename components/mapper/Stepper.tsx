import { useEditorStore } from "@/stores/editor";
import { Component, getAllChildrenComponents } from "@/utils/editor";
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
  const { setTreeComponentCurrentState } = useEditorStore((state) => state);

  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );

  const header = component.children?.find(
    (child) => child.name === "StepperHeader",
  );
  const steppers = component.children?.find(
    (child) => child.name === "StepperContent",
  );

  useEffect(() => {
    // Reflect any external changes to the activeStep property
    setActive(activeStep);
    header?.children?.forEach((child: Component, index: number) => {
      const state = activeStep > index ? "checked" : "default";

      setTreeComponentCurrentState(child.id!, state);
      const allChildren = getAllChildrenComponents(child);
      allChildren.forEach((c) => setTreeComponentCurrentState(c.id!, state));
    });
  }, [activeStep, active, setTreeComponentCurrentState, header?.children]);

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
