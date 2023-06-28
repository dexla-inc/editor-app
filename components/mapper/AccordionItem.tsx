import { Component } from "@/utils/editor";
import {
  Accordion as MantineAccordion,
  AccordionItemProps,
} from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionItemProps;

export const AccordionItem = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAccordion.Item {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAccordion.Item>
  );
};
