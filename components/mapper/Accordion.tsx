import { EditableComponentMapper } from "@/utils/editor";
import { AccordionProps, Accordion as MantineAccordion } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useRenderData } from "@/hooks/components/useRenderData";

type Props = EditableComponentMapper & AccordionProps;

const AccordionComponent = forwardRef(
  ({ renderTree, shareableContent, component, id, ...props }: Props, ref) => {
    const { children, icon, ...componentProps } = component.props as any;

    const { renderData } = useRenderData({
      component,
      shareableContent,
    });

    return (
      <MantineAccordion
        chevron={null}
        ref={ref}
        {...props}
        {...componentProps}
        data-id={id}
        styles={{ label: { padding: 0 }, chevron: { display: "none" } }}
      >
        {renderData({ renderTree })}
      </MantineAccordion>
    );
  },
);
AccordionComponent.displayName = "Accordion";

export const Accordion = memo(withComponentWrapper<Props>(AccordionComponent));
