import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Pagination as MantinePagination,
  PaginationProps,
} from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & PaginationProps;

const PaginationComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { triggers, ...componentProps } = component.props as any;

    const { onChange, ...allTriggers } = triggers;

    const customOnChange = (value: any) => {
      const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
      updateTreeComponent({ componentId: component.id!, props: { value } });
      onChange && onChange(value);
    };

    return (
      <MantinePagination
        ref={ref}
        {...props}
        {...componentProps}
        {...allTriggers}
        onChange={customOnChange}
      />
    );
  },
);
PaginationComponent.displayName = "Pagination";

export const Pagination = memo(
  withComponentWrapper<Props>(PaginationComponent),
  isSame,
);
