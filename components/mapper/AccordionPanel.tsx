import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import {
  AccordionPanelProps,
  Accordion as MantineAccordion,
} from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & AccordionPanelProps;

const AccordionPanelComponent = forwardRef(
  (
    {
      renderTree,
      shareableContent,
      component,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const { children, triggers, ...componentProps } = component.props as any;

    return (
      <MantineAccordion.Panel
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children?.toString()}
        <ChildrenWrapper />
      </MantineAccordion.Panel>
    );
  },
);
AccordionPanelComponent.displayName = "AccordionPanelComponent";

export const AccordionPanel = memo(
  withComponentWrapper<Props>(AccordionPanelComponent),
);
