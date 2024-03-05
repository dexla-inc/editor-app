import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import {
  Component,
  ComponentTree,
  EditableComponentMapper,
  getAllChildrenComponents,
} from "@/utils/editor";
import { Stepper as MantineStepper, StepperProps } from "@mantine/core";
import { forwardRef, memo, useEffect, useState } from "react";

type Props = EditableComponentMapper & StepperProps;

const StepperComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const {
      activeStep,
      breakpoint,
      children,
      triggers,
      icon,
      color,
      ...componentProps
    } = component.props as any;

    const [active, setActive] = useState(activeStep ?? 1);
    const setTreeComponentCurrentState = useEditorStore(
      (state) => state.setTreeComponentCurrentState,
    );

    const isVertical = component.props?.orientation === "vertical";

    useEffect(() => {
      // Reflect any external changes to the activeStep property
      setActive(activeStep);
      component?.children?.forEach((step: ComponentTree, index: number) => {
        const state =
          activeStep === index
            ? "Active"
            : activeStep > index
            ? "Complete"
            : "default";

        step.children?.forEach((sectionTree) => {
          const section =
            useEditorStore.getState().componentMutableAttrs[sectionTree?.id!];
          if (section.name === "StepperStepHeader") {
            const allChildren = getAllChildrenComponents(section);
            allChildren.forEach((c) =>
              setTreeComponentCurrentState(c.id!, state),
            );
          }
        });
      });
    }, [activeStep, setTreeComponentCurrentState, component?.children]);

    return (
      <MantineStepper
        ref={ref}
        {...props}
        active={active}
        breakpoint={breakpoint}
        {...componentProps}
        {...triggers}
        {...(isVertical && { color })}
        {...(!isVertical
          ? {
              styles: {
                stepIcon: { display: "none" },
                separator: { display: "none" },
                step: { width: `calc(100% / ${component?.children?.length})` },
                stepBody: { width: "100%", marginLeft: 0 },
              },
            }
          : {})}
      >
        {(component?.children ?? []).map(
          (child: ComponentTree, index: number) => {
            const { header, content } = (child.children ?? []).reduce(
              (acc, currTree) => {
                const curr =
                  useEditorStore.getState().componentMutableAttrs[
                    currTree?.id!
                  ];
                if (curr.name === "StepperStepHeader") acc.header = curr;
                if (curr.name === "StepperStepContent") acc.content = curr;
                return acc;
              },
              { header: {}, content: {} } as {
                header: ComponentTree;
                content: ComponentTree;
              },
            );

            return (
              <MantineStepper.Step
                key={index}
                label={(header.children ?? []).map((grandChild) => {
                  return renderTree(grandChild);
                })}
              >
                {(content.children ?? []).map((grandChild) => {
                  return renderTree(grandChild);
                })}
              </MantineStepper.Step>
            );
          },
        )}
      </MantineStepper>
    );
  },
);
StepperComponent.displayName = "Stepper";

export const Stepper = memo(withComponentWrapper(StepperComponent), isSame);
