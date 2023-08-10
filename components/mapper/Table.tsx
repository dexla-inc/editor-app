import { Component } from "@/utils/editor";
import { Table as MantineTable, TableProps } from "@mantine/core";
import startCase from "lodash.startcase";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

export const Table = ({ renderTree, component, ...props }: Props) => {
  const {
    children,
    data: dataProp,
    style,
    ...componentProps
  } = component.props as any;

  const data = dataProp?.value ?? dataProp;
  const dataSample = (data ?? [])?.[0];

  if (!dataSample) {
    return null;
  }

  const heads = Object.keys(dataSample).map((key: string) => {
    return <th key={key}>{startCase(key)}</th>;
  });

  const rows = (data ?? [])?.map((_data: any) => (
    <tr key={JSON.stringify(_data)}>
      {Object.keys(_data).map((key: string) => {
        const val = _data[key];
        return (
          <td key={key}>
            {typeof val === "string" ? val : JSON.stringify(val)}
          </td>
        );
      })}
    </tr>
  ));

  return (
    <MantineTable
      {...props}
      {...componentProps}
      style={{ ...style, width: "100%" }}
    >
      <thead>
        <tr>{heads}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </MantineTable>
  );
};
