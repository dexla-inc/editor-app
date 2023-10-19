import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AccordionProps, Accordion as MantineAccordion } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionProps;

const AccordionComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, icon, ...componentProps } = component.props as any;

  return (
    <MantineAccordion
      {...(icon && { chevron: <Icon name={icon} /> })}
      {...props}
      {...componentProps}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAccordion>
  );
};

export const Accordion = memo(AccordionComponent, isSame);
