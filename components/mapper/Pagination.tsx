import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Pagination as MantinePagination,
  PaginationProps,
} from "@mantine/core";
import { forwardRef, memo } from "react";
import { useEditorStore } from "@/stores/editor";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & PaginationProps;

const PaginationComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { triggers, ...componentProps } = component.props as any;
    const updateTreeComponent = useEditorStore(
      (state) => state.updateTreeComponent,
    );

    const { onChange, ...allTriggers } = triggers;

    const customOnChange = (value: any) => {
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
