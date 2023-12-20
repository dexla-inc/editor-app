import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Table as MantineTable, ScrollArea, TableProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

export const TableComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <ScrollArea w={props.style?.width ?? "100%"}>
      <MantineTable {...props} {...componentProps}>
        {component.children?.map((child) => renderTree(child))}
      </MantineTable>
    </ScrollArea>
  );
};

export const TableHead = ({ renderTree, component }: Props) => {
  return <thead>{component.children?.map((child) => renderTree(child))}</thead>;
};

export const TableBody = ({ renderTree, component }: Props) => {
  return <tbody>{component.children?.map((child) => renderTree(child))}</tbody>;
};

export const TableRow = ({ renderTree, component, ...props }: Props) => {
  const { ...componentProps } = component.props as any;

  return (
    <tr {...props} {...componentProps}>
      {component.children?.map((child) => renderTree(child))}
    </tr>
  );
};

export const TableHeaderCell = ({ renderTree, component, ...props }: Props) => {
  const { children, style, triggers, ...componentProps } =
    component.props as any;

  return (
    <th style={{ ...style }} {...componentProps}>
      {component.children?.map((child) => renderTree(child))}
    </th>
  );
};

export const TableCell = ({ renderTree, component, ...props }: Props) => {
  const { children, style, triggers, ...componentProps } =
    component.props as any;

  return (
    <td style={{ ...style }} {...componentProps}>
      {component.children?.map((child) => renderTree(child))}
    </td>
  );
};

export const Table = memo(TableComponent, isSame);
