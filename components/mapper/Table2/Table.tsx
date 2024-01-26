import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Table as MantineTable, ScrollArea, TableProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/useEndpoint";
import { jsonStructure as tableRowStructure } from "@/components/mapper/structure/table/TableRow";
import { jsonStructure as tableCellStructure } from "@/components/mapper/structure/table/TableCell";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

export const TableComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    const { data } = useEndpoint({
      component,
    });

    const childrenStructure = data?.map((row: any, index: number) => {
      const columns = component.onLoad?.columns?.map((c: string) => {
        return tableCellStructure();
      });

      return tableRowStructure({ children: columns });
    });

    return (
      <ScrollArea w={props.style?.width ?? "100%"}>
        <MantineTable ref={ref} {...props} {...componentProps}>
          <thead>
            {component.onLoad?.columns?.map((c: string) => (
              <td key={c}>{c}</td>
            ))}
          </thead>
          <tbody>asdf</tbody>
          {component.children?.map((child) => renderTree(child))}
        </MantineTable>
      </ScrollArea>
    );
  },
);
TableComponent.displayName = "Table";

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

export const Table = memo(withComponentWrapper<Props>(TableComponent), isSame);
