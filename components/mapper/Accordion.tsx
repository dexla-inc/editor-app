import { EditableComponentMapper } from "@/utils/editor";
import { AccordionProps, Accordion as MantineAccordion } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & AccordionProps;

const AccordionComponent = forwardRef(
  ({ renderTree, shareableContent, component, id, ...props }: Props, ref) => {
    const { children, icon, ...componentProps } = component.props as any;

    return (
      <MantineAccordion
        chevron={null}
        ref={ref}
        {...props}
        {...componentProps}
        styles={{ label: { padding: 0 }, chevron: { display: "none" } }}
        wrapperProps={{ "data-id": id }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children?.toString()}
      </MantineAccordion>
    );
  },
);
AccordionComponent.displayName = "Accordion";

export const Accordion = memo(withComponentWrapper<Props>(AccordionComponent));
