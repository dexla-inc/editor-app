import { Component } from "@/utils/editor";
import {
  Accordion as MantineAccordion,
  AccordionPanelProps,
} from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionPanelProps;

export const AccordionPanel = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAccordion.Panel {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAccordion.Panel>
  );
};
