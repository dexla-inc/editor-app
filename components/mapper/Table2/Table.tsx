import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Table as MantineTable,
  ScrollArea,
  TableProps,
  Box,
} from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/useEndpoint";

type Props = {
  renderTree: (component: Component, shareableContent: any) => any;
  component: Component;
  shareableContent?: any;
} & TableProps;

export const TableComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, triggers, dataType, ...componentProps } =
      component.props as any;
    const { data } = useEndpoint({
      component,
    });

    return (
      <ScrollArea
        w={props.style?.width ?? "100%"}
        mah={props.style?.height ?? "auto"}
      >
        <MantineTable ref={ref} {...props} {...componentProps} {...triggers}>
          <thead>
            {(Array.isArray(component?.onLoad?.columns)
              ? component?.onLoad?.columns
              : (component?.onLoad?.columns ?? "")?.split(",")
            ).map((c: string) => (
              <td key={c}>{c}</td>
            ))}
          </thead>
          <tbody>
            {(Array.isArray(data) ? data : [])?.map((item: any, i: number) => {
              return (
                <tr key={i}>
                  {component.children?.map((child, parentIndex) =>
                    renderTree(child, {
                      ...shareableContent,
                      data: item,
                      parentIndex,
                    }),
                  )}
                </tr>
              );
            })}
          </tbody>
        </MantineTable>
      </ScrollArea>
    );
  },
);
TableComponent.displayName = "Table";

export const TableHead = ({
  renderTree,
  component,
  shareableContent,
}: Props) => {
  return (
    <thead>
      {component.children?.map((child) => renderTree(child, shareableContent))}
    </thead>
  );
};

export const TableBody = ({
  renderTree,
  component,
  shareableContent,
}: Props) => {
  return (
    <tbody>
      {component.children?.map((child) => renderTree(child, shareableContent))}
    </tbody>
  );
};

export const TableRow = ({
  renderTree,
  component,
  shareableContent,
  ...props
}: Props) => {
  const { ...componentProps } = component.props as any;

  return (
    <tr {...props} {...componentProps}>
      {component.children?.map((child) => renderTree(child, shareableContent))}
    </tr>
  );
};

export const TableHeaderCell = ({
  renderTree,
  component,
  shareableContent,
}: Props) => {
  const { children, style, triggers, ...componentProps } =
    component.props as any;

  return (
    <th style={{ ...style }} {...componentProps}>
      {component.children?.map((child) => renderTree(child, shareableContent))}
    </th>
  );
};

export const TableCell = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { style, triggers, ...componentProps } = component.props as any;

    return (
      <Box
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        component="td"
      >
        {component.children?.map((child) =>
          renderTree(child, shareableContent),
        )}
      </Box>
    );
  },
);
TableCell.displayName = "TableCell";

export const Table = memo(withComponentWrapper<Props>(TableComponent), isSame);
