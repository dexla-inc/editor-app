import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Table as MantineTable, TableProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

const Tablecomponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineTable {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTable>
  );
};

export const Table = memo(Tablecomponent, isSame);
