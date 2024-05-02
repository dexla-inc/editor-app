import { EditableComponentMapper } from "@/utils/editor";
import {
  Accordion as MantineAccordion,
  AccordionPanelProps,
} from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & AccordionPanelProps;

const AccordionPanelComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineAccordion.Panel ref={ref} {...props} {...componentProps}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children?.toString()}
      </MantineAccordion.Panel>
    );
  },
);
AccordionPanelComponent.displayName = "AccordionPanelComponent";

export const AccordionPanel = memo(
  withComponentWrapper<Props>(AccordionPanelComponent),
);
