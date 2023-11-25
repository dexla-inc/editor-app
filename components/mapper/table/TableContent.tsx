import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

const TableBodyComponent = ({ renderTree, component, ...props }: Props) => {
  const {
    type: TableChildElement,
    children,
    ...componentProps
  } = component.props as any;

  return (
    <TableChildElement {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </TableChildElement>
  );
};

export const TableContent = memo(TableBodyComponent, isSame);
