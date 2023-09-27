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

  useEffect(() => {
    // Reflect any external changes to the activeStep property
    setActive(activeStep);
    component?.children?.forEach((step: Component, index: number) => {
      const state = activeStep > index ? "checked" : "default";

      step.children?.forEach((section: Component) => {
        if (section.name === "StepperStepHeader") {
          const allChildren = getAllChildrenComponents(section);
          allChildren.forEach((c) =>
            setTreeComponentCurrentState(c.id!, state),
          );
        }
      });
    });
  }, [activeStep, active, setTreeComponentCurrentState, component?.children]);

  return (
    <MantineStepper
      {...props}
      active={active}
      breakpoint={breakpoint}
      {...componentProps}
      {...triggers}
      styles={{
        stepIcon: { display: "none" },
        separator: { display: "none" },
        step: { width: `calc(100% / ${component?.children?.length})` },
        stepBody: { width: "100%", marginLeft: 0 },
      }}
    >
      {(component?.children ?? []).map((child: Component, index: number) => {
        const { header, content } = (child.children ?? []).reduce(
          (acc, curr) => {
            if (curr.name === "StepperStepHeader") acc.header = curr;
            if (curr.name === "StepperStepContent") acc.content = curr;
            return acc;
          },
          { header: {}, content: {} } as {
            header: Component;
            content: Component;
          },
        );

        return (
          <MantineStepper.Step
            key={index}
            label={(header.children ?? []).map((grandChild: Component) => {
              return renderTree(grandChild);
            })}
          >
            {(content.children ?? []).map((grandChild: Component) => {
              return renderTree(grandChild);
            })}
          </MantineStepper.Step>
        );
      })}
    </MantineStepper>
  );
};
