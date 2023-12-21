import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AccordionProps, Accordion as MantineAccordion } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionProps;

const AccordionComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, icon, ...componentProps } = component.props as any;

    return (
      <MantineAccordion
        ref={ref}
        {...(icon && { chevron: <Icon name={icon} /> })}
        {...props}
        {...componentProps}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineAccordion>
    );
  },
);
AccordionComponent.displayName = "Accordion";

export const Accordion = memo(
  withComponentWrapper<Props>(AccordionComponent),
  isSame,
);
