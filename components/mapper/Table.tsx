import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { useEditorStore } from "@/stores/editor";
import { Action } from "@/utils/actions";
import { Component, getAllActions } from "@/utils/editor";
import { flattenKeysWithRoot } from "@/utils/flattenKeys";
import { TableProps } from "@mantine/core";
import get from "lodash.get";
import startCase from "lodash.startcase";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TableProps;

export const Table = ({ renderTree, component, ...props }: Props) => {
  const router = useRouter();
  const editorTree = useEditorStore((state) => state.tree);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const projectId = router.query.id as string;

  const {
    children,
    data: dataProp,
    headers,
    config,
    style,
    ...componentProps
  } = component.props as any;

  let _data = dataProp?.value ?? dataProp;
  const [data, setData] = useState(_data);
  const dataSample = (data ?? [])?.[0];

  const columns = Object.keys(dataSample).reduce((acc: any[], key: string) => {
    if (headers[key]) {
      return acc.concat({
        header: startCase(key),
        accessorKey: key,
        columnDefType: "display",
        enableSorting: config?.sorting,
        enableGlobalFilter: config?.filter,
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
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnFilters: false,
  });

  useEffect(() => {
    const getEndpoint = async (originalAction: any, binded: any) => {
      const { results } = await getDataSourceEndpoints(
        projectId,
        originalAction.action.datasource.id
      );

      const _endpoint = results.find(
        (e) => e.id === originalAction.action.endpoint
      );

      if (_endpoint?.exampleResponse) {
        const json = JSON.parse(_endpoint?.exampleResponse as string);
        const binds = flattenKeysWithRoot(json);
        const data = get(binds, binded.value);
        updateTreeComponent(
          component.id!,
          {
            data: { value: data },
            headers: Object.keys(data[0]).reduce((acc, key) => {
              return { ...acc, [key]: true };
            }, {}),
          },
          false
        );
        setData(data);
      }
    };

    if (!isPreviewMode && !dataProp?.value) {
      const actions = getAllActions(editorTree.root);
      let binded = null;
      let originalAction = null;

      for (const _action of actions) {
        const action = _action as unknown as Action;
        if (action.action.name === "bindResponseToComponent") {
          binded = (action.action.binds ?? [])?.find((bind: any) => {
            return bind.component === component.id;
          });

          if (binded) {
            originalAction = actions.find((a) => {
              return a.id === action.sequentialTo;
            });
            break;
          }
        }
      }

      if (binded && originalAction) {
        getEndpoint(originalAction, binded);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    projectId,
    isPreviewMode,
    component.id,
    updateTreeComponent,
    dataProp?.value,
  ]);

  return (
    <MantineReactTable
      {...props}
      {...componentProps}
      style={{ ...style, width: "100%" }}
      table={table}
    />
  );
};
