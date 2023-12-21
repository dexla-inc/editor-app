import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  AccordionItemProps,
  Accordion as MantineAccordion,
} from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AccordionItemProps;

const AccordionItemComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, bg, ...componentProps } = component.props as any;

    return (
      <MantineAccordion.Item ref={ref} {...props} {...componentProps}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineAccordion.Item>
    );
  },
);
AccordionItemComponent.displayName = "AccordionItem";

export const AccordionItem = memo(
  withComponentWrapper<Props>(AccordionItemComponent),
  isSame,
);
