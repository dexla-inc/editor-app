import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  AccordionControlProps,
  Accordion as MantineAccordion,
} from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionControlProps;

const AccordionControlComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineAccordion.Control
        ref={ref}
        {...props}
        {...componentProps}
        style={{ padding: 0 }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineAccordion.Control>
    );
  },
);
AccordionControlComponent.displayName = "AccordionControl";

export const AccordionControl = memo(
  withComponentWrapper<Props>(AccordionControlComponent),
  isSame,
);
