import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

const TableRowComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <tr {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </tr>
  );
};

export const TableRow = memo(TableRowComponent, isSame);
