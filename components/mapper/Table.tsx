import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component, getAllComponentsByName } from "@/utils/editor";
import {
  Flex,
  Pagination,
  ScrollArea,
  Select,
  TableProps,
  Text,
} from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
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
    dataPath = "",
    repeatedIndex,
    triggers,
    ...componentProps
  } = component.props as any;

  const { onSort, onRowSelect, ...tableTriggers } = triggers ?? {};

  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [rowsSelected, setRowsSelected] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState<string | null>("5");

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
    data = cloneDeep(
      dataProp?.value ?? dataProp ?? exampleData.value ?? exampleData,
    );
    if (dataPath) {
      const path = dataPath.replaceAll("[0]", "");
      data = get(dataProp, `base.${path}`, dataProp?.value ?? dataProp);
    }
  } else {
    data = exampleData.value ?? exampleData;
    if (dataPath) {
      const path = dataPath.replaceAll("[0]", "");
      data = get(data, path, data);
    }
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
            enablePagination: true,
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
    initialState: { pagination: { pageIndex: 1, pageSize: 5 } },
    enableSorting: config?.sorting,
    enableRowSelection: config?.select,
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
      pagination: {
        pageIndex,
        pageSize: parseInt(pageSize ?? "5"),
      },
    },
    manualSorting: true,
    manualPagination: true,
    isMultiSortEvent: () => true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowsSelected,
    mantineTableProps: {
      striped: true,
      withColumnBorders: true,
      sx: style,
    },
    mantineTableHeadRowProps: { sx: { backgroundColor: "lightgrey" } },
  });

  if (componentProps.loading) {
    return <MantineSkeleton height={300} />;
  }

  const paginationChildren = getAllComponentsByName(component, "Pagination");
  if (paginationChildren[0] && dataProp?.base) {
    paginationChildren[0]!.props!.total = exampleData?.base?.total_pages;
    paginationChildren[0]!.props!.value = exampleData?.base?.page;
  }

  return (
    <>
      <ScrollArea
        w={style?.width ?? "100%"}
        h={style?.height ?? "auto"}
        offsetScrollbars
      >
        <MantineReactTable
          {...props}
          {...componentProps}
          {...tableTriggers}
          table={table}
        />
        {dataProp?.base &&
          component.children?.map((child) => renderTree(merge(child)))}
        {!dataProp?.base && (
          <Flex justify="flex-end" gap={10} py={10} align="center">
            <Flex>
              <Text>
                Showing {pageSize} results of {data.length}
              </Text>
            </Flex>
            <Select
              data={["5", "10", "15"]}
              value={pageSize}
              style={{ width: "70px" }}
              onChange={setPageSize}
            />
            <Pagination
              total={Math.ceil(data.length / 5)}
              value={pageIndex}
              onChange={setPageIndex}
            />
          </Flex>
        )}
      </ScrollArea>
    </>
  );
};

export const Table = memo(TableComponent, isSame);
