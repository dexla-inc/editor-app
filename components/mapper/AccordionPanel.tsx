import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Accordion as MantineAccordion,
  AccordionPanelProps,
} from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionPanelProps;

const AccordionPanelComponent = ({
  renderTree,
  component,
  ...props
}: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAccordion.Panel {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAccordion.Panel>
  );
};

export const AccordionPanel = memo(AccordionPanelComponent, isSame);
