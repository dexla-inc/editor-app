import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Table as MantineTable, TableProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

export const Table = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineTable {...props} {...componentProps}>
      {component.children?.map((child) => renderTree(child))}
    </MantineTable>
  );
};

export const TableHead = ({ renderTree, component }: Props) => {
  return <thead>{component.children?.map((child) => renderTree(child))}</thead>;
};

export const TableBody = ({ renderTree, component }: Props) => {
  return (
    <tbody style={{ padding: "0 10px" }}>
      {component.children?.map((child) => renderTree(child))}
    </tbody>
  );
};

export const TableRow = ({ renderTree, component }: Props) => {
  return <tr>{component.children?.map((child) => renderTree(child))}</tr>;
};

export const TableCell = ({ renderTree, component, ...props }: Props) => {
  const { children, style, triggers, ...componentProps } =
    component.props as any;

  return (
    <td
      style={{ paddingLeft: 0, paddingRight: 0, ...style }}
      {...componentProps}
    >
      {component.children?.map((child) => renderTree(child))}
    </td>
  );
};
