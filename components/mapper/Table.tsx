import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { TableProps } from "@mantine/core";
import isEmpty from "lodash.isempty";
import startCase from "lodash.startcase";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

export const Table = ({ renderTree, component, ...props }: Props) => {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const {
    children,
    data: dataProp,
    exampleData = {},
    headers = {},
    config = {},
    style,
    ...componentProps
  } = component.props as any;

  const data = !isPreviewMode
    ? isEmpty(exampleData?.value ?? exampleData)
      ? dataProp
      : exampleData?.value ?? exampleData
    : dataProp?.value ?? dataProp;
  const dataSample = (data ?? [])?.[0];

  const columns = Object.keys(dataSample).reduce((acc: any[], key: string) => {
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
  }, []);

  const table = useMantineReactTable({
    data,
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

  return (
    <MantineReactTable
      {...props}
      {...componentProps}
      style={{ ...style, width: "100%" }}
      table={table}
    />
  );
};
