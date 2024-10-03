import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import {
  AccordionControlProps,
  Accordion as MantineAccordion,
} from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & AccordionControlProps;

const AccordionControlComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const { children, triggers, ...componentProps } = component.props as any;

    return (
      <MantineAccordion.Control
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        style={{ padding: 0 }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children?.toString()}
      </MantineAccordion.Control>
    );
  },
);
AccordionControlComponent.displayName = "AccordionControl";

export const AccordionControl = memo(
  withComponentWrapper<Props>(AccordionControlComponent),
);
