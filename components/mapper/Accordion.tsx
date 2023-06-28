import { Component } from "@/utils/editor";
import { Accordion as MantineAccordion, AccordionProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionProps;

export const Accordion = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAccordion {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAccordion>
  );
};
