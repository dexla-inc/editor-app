import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useRenderData } from "@/hooks/components/useRenderData";
import { EditableComponentMapper } from "@/utils/editor";
import {
  AccordionItemProps,
  Accordion as MantineAccordion,
} from "@mantine/core";
import { nanoid } from "nanoid";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & AccordionItemProps;

const AccordionItemComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const { bg, triggers, ...componentProps } = component.props as any;
    const { renderData } = useRenderData({
      component,
      shareableContent,
    });

    const { children } = component?.onLoad;

    return (
      <MantineAccordion.Item
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        value={String(children || nanoid())}
      >
        {renderData({ renderTree })}
      </MantineAccordion.Item>
    );
  },
);
AccordionItemComponent.displayName = "AccordionItem";

export const AccordionItem = memo(
  withComponentWrapper<Props>(AccordionItemComponent),
);
