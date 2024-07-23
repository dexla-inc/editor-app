import { EditableComponentMapper } from "@/utils/editor";
import {
  AccordionItemProps,
  Accordion as MantineAccordion,
} from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useRenderData } from "@/hooks/components/useRenderData";

type Props = EditableComponentMapper & AccordionItemProps;

const AccordionItemComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const { children, bg, ...componentProps } = component.props as any;
    const { renderData } = useRenderData({
      component,
      shareableContent,
    });
    console.log("props", props);
    console.log("componentProps", componentProps);
    return (
      <MantineAccordion.Item ref={ref} {...props} {...componentProps}>
        {renderData({ renderTree })}
      </MantineAccordion.Item>
    );
  },
);
AccordionItemComponent.displayName = "AccordionItem";

export const AccordionItem = memo(
  withComponentWrapper<Props>(AccordionItemComponent),
);
