import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

const TableCellComponent = ({ renderTree, component, ...props }: Props) => {
  const {
    type: TableRowItem,
    children,
    ...componentProps
  } = component.props as any;

  return (
    <TableRowItem {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </TableRowItem>
  );
};

export const TableCell = memo(TableCellComponent, isSame);
