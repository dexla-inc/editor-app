import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { TableProps } from "@mantine/core";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import startCase from "lodash.startcase";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { memo } from "react";
import { MantineSkeleton } from "./skeleton/Skeleton";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

const TableComponent = ({ renderTree, component, ...props }: Props) => {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const {
    children,
    data: dataProp,
    exampleData = {},
    headers = {},
    config = {},
    style,
    dataPath,
    ...componentProps
  } = component.props as any;

  let data = isEmpty(exampleData?.value ?? exampleData)
    ? dataProp?.value ?? dataProp
    : exampleData?.value ?? exampleData;

  if (isPreviewMode) {
    if (dataPath) {
      const path = dataPath.replaceAll("[0]", "");
      data = get(dataProp?.base ?? {}, path) ?? dataProp?.value ?? dataProp;
    } else {
      data = dataProp?.value ?? dataProp;
    }
  } else if (dataPath) {
    const path = dataPath.replaceAll("[0]", "");
    data = get(data ?? {}, path) ?? data;
  }

  const dataSample = (data ?? [])?.[0];

  const columns = dataSample
    ? Object.keys(dataSample).reduce((acc: any[], key: string) => {
        if (headers?.[key]) {
          return acc.concat({
            header: startCase(key),
            accessorKey: key,
            columnDefType: "display",
            enableSorting: config?.sorting,
            enableGlobalFilter: config?.filter,
            enablePagination: config?.pagination,
            Cell: ({ row }: any) => {
              const val = row.original[key];
              return typeof val === "object" ? JSON.stringify(val) : val;
            },
          });
        }

        return acc;
      }, [])
    : [];

  const table = useMantineReactTable({
    data: data ?? [],
    columns,
    enableSorting: config?.sorting,
    enableRowSelection: config?.select,
    enableRowNumbers: config?.numbers,
    enableGlobalFilter: config?.filter,
    enableTopToolbar: config?.filter,
    enablePagination: config?.pagination,
    enableBottomToolbar: config?.pagination,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnFilters: false,
    state: { isLoading: componentProps.loading },
  });

  // check if data is being fetched
  const isLoading = componentProps.loading ?? false;

  if (isLoading) <MantineSkeleton height={style.height ?? 300} />;

  return (
    <MantineReactTable
      {...props}
      {...componentProps}
      style={{ ...style, width: "100%" }}
      table={table}
    />
  );
};

export const Table = memo(TableComponent, isSame);
