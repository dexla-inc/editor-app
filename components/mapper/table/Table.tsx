import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Table as MantineTable, ScrollArea, TableProps } from "@mantine/core";
import merge from "lodash.merge";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

const TableComponent = ({ component, renderTree, ...props }: Props) => {
  const { style, ...componentProps } = component.props as any;
  return (
    <ScrollArea w={style?.width ?? "100%"}>
      <MantineTable
        striped
        sx={merge({}, style)}
        {...componentProps}
        {...props}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(merge(child)))
          : null}
      </MantineTable>
    </ScrollArea>
  );
};

export const Table = memo(TableComponent, isSame);
