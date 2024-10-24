import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useRenderData } from "@/hooks/components/useRenderData";
import { EditableComponentMapper } from "@/utils/editor";
import { AccordionProps, Accordion as MantineAccordion } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & AccordionProps;

const AccordionComponent = forwardRef(
  (
    {
      renderTree,
      shareableContent,
      component,
      id,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const { children, icon, triggers, ...componentProps } =
      component.props as any;

    const { renderData } = useRenderData({
      component,
      shareableContent,
    });

    return (
      <MantineAccordion
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        data-id={id}
        styles={{ label: { padding: 0 } }}
      >
        {renderData({ renderTree })}
        <ChildrenWrapper />
      </MantineAccordion>
    );
  },
);
AccordionComponent.displayName = "Accordion";

export const Accordion = memo(withComponentWrapper<Props>(AccordionComponent));
