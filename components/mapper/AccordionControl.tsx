import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  AccordionControlProps,
  Accordion as MantineAccordion,
} from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionControlProps;

const AccordionControlComponent = ({
  renderTree,
  component,
  ...props
}: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAccordion.Control {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAccordion.Control>
  );
};

export const AccordionControl = memo(AccordionControlComponent, isSame);
