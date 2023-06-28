import { Component } from "@/utils/editor";
import {
  Accordion as MantineAccordion,
  AccordionControlProps,
} from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionControlProps;

export const AccordionControl = ({
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
