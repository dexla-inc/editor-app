import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Flex, TableProps } from "@mantine/core";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import startCase from "lodash.startcase";
import {
  MRT_SortingState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import { memo, useEffect, useState } from "react";

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
    repeatedIndex,
    triggers,
    ...componentProps
  } = component.props as any;

  const { onSort, onRowSelect, ...tableTriggers } = triggers ?? {};

  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [rowsSelected, setRowsSelected] = useState<any>([]);

  useEffect(() => {
    const sortingString = sorting
      .map((item) => (!item.desc ? "" : "-") + item.id)
      .reverse()
      .join(",");

    onSort && onSort(sortingString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  useEffect(() => {
    onRowSelect && onRowSelect(Object.keys(rowsSelected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsSelected]);

  let data = [];

  if (isPreviewMode) {
    data = dataProp?.value ?? dataProp ?? exampleData.value ?? exampleData;
    if (dataPath) {
      const path = dataPath.replaceAll("[0]", "");
      data = get(dataProp, `base.${path}`, dataProp?.value ?? dataProp);
    }
  } else if (dataPath) {
    data = exampleData.value ?? exampleData;
    const path = dataPath.replaceAll("[0]", "");
    data = get(data, path, data);
  }

  const dataSample = ((data as any) ?? [])?.[0];

  const isAllHeadersHidden = Object.values(headers).every((val) => !val);

  const columns = dataSample
    ? Object.keys(dataSample).reduce((acc: any[], key: string) => {
        if (isEmpty(headers) || isAllHeadersHidden || headers?.[key]) {
          return acc.concat({
            header: startCase(key),
            accessorKey: key,
            columnDefType: "display",
            enableSorting: config?.sorting,
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
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnFilters: false,
    state: {
      isLoading: componentProps.loading,
      sorting,
      rowSelection: rowsSelected,
    },
    manualSorting: true,
    manualPagination: true,
    isMultiSortEvent: () => true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowsSelected,
  });

  if (componentProps.loading) {
    return <MantineSkeleton height={300} />;
  }

  return (
    <Flex direction="column">
      <MantineReactTable
        {...props}
        {...componentProps}
        {...tableTriggers}
        style={{ ...style, width: "100%" }}
        table={table}
      />
      {config?.pagination && (
        <Flex py={10} justify="flex-end" gap={20} align="center">
          {component.children && component.children.length > 0
            ? component.children?.map((child) => renderTree(merge(child)))
            : children}
        </Flex>
      )}
    </Flex>
  );
};

export const Table = memo(TableComponent, isSame);
