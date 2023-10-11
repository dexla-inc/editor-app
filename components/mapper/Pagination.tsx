import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Pagination as MantinePagination,
  PaginationProps,
} from "@mantine/core";
import { memo } from "react";
import { useEditorStore } from "@/stores/editor";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & PaginationProps;

const PaginationComponent = ({ renderTree, component, ...props }: Props) => {
  const { triggers, ...componentProps } = component.props as any;
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );

  const { onChange, ...allTriggers } = triggers;

  const customOnChange = (value: any) => {
    updateTreeComponent(component.id!, { value });
    onChange && onChange(value);
  };

  return (
    <MantinePagination
      {...props}
      {...componentProps}
      {...allTriggers}
      onChange={customOnChange}
    />
  );
};

export const Pagination = memo(PaginationComponent, isSame);
