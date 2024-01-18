import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import { useRequestProp } from "@/hooks/useRequestProp";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { Endpoint } from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { BindPlaceDataAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { ApiType } from "@/utils/dashboardTypes";
import { getAllComponentsByName } from "@/utils/editor";
import {
  Box,
  Button,
  Flex,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useRouter } from "next/router";
import React, { forwardRef, useEffect, useState } from "react";

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, any>(
  ({ method, label, ...others }: any, ref) => (
    <Flex ref={ref} gap="xs" {...others}>
      <Box
        p={2}
        sx={{
          fontSize: 8,
          color: "white",
          border: colors[method as MethodTypes].color + " 1px solid",
          background: colors[method as MethodTypes].color,
          borderRadius: "4px",
          width: 38,
          textAlign: "center",
        }}
      >
        {method}
      </Box>
      <Text size="xs" truncate>
        {label}
      </Text>
    </Flex>
  ),
);

type FormValues = Omit<BindPlaceDataAction, "name" | "datasource">;

type Props = {
  form: UseFormReturnType<FormValues>;
};

export const BindPlaceDataFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  const editorTree = useEditorStore((state) => state.tree);
  const setTree = useEditorStore((state) => state.setTree);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  const [endpoints, setEndpoints] = useState<Array<Endpoint> | undefined>(
    undefined,
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(undefined);

  const router = useRouter();
  const projectId = router.query.id as string;

  const { page, dataSources } = useRequestProp();

  const containers = getAllComponentsByName(editorTree.root, "Container");

  useEffect(() => {
    const getEndpoints = async () => {
      const { results } = await getDataSourceEndpoints(projectId, {
        authOnly: false,
      });
      setEndpoints(results);
    };

    if ((dataSources.data?.results ?? []).length > 0) {
      getEndpoints();
    }
  }, [dataSources.data, projectId]);

  useEffect(() => {
    if (
      form.values.endpoint &&
      !selectedEndpoint &&
      (endpoints ?? [])?.length > 0
    ) {
      setSelectedEndpoint(
        endpoints?.find((e) => e.id === form.values.endpoint),
      );
    }
  }, [endpoints, form.values.endpoint, selectedEndpoint]);

  const showLoaderInputProps = form.getInputProps("showLoader");

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return endpoints && endpoints.length > 0 ? (
    <>
      <Stack spacing="xs">
        <Select
          size="xs"
          label="Component To Bind"
          placeholder="Select a component"
          data={containers.map((container) => {
            return {
              label: container.description ?? container.id,
              value: container.id!,
            };
          })}
          {...form.getInputProps("componentId")}
        />

        <Select
          size="xs"
          label="Get Geometry Endpoint"
          placeholder="The endpoint to call"
          searchable
          clearable
          data={
            endpoints?.map((endpoint) => {
              return {
                label: endpoint.relativeUrl,
                value: endpoint.id,
                method: endpoint.methodType,
              };
            }) ?? []
          }
          itemComponent={SelectItem}
          {...form.getInputProps("endpoint")}
          onChange={(selected) => {
            form.setFieldValue("endpoint", selected!);
            setSelectedEndpoint(endpoints?.find((e) => e.id === selected));
          }}
          icon={
            <Flex gap="lg">
              <Box
                p={2}
                sx={{
                  fontSize: 8,
                  color: "white",
                  border:
                    selectedEndpoint?.methodType &&
                    colors[selectedEndpoint.methodType].color + " 1px solid",
                  background:
                    selectedEndpoint?.methodType &&
                    colors[selectedEndpoint.methodType].color,
                  borderRadius: "4px",
                  width: 20,
                  textAlign: "center",
                }}
              >
                {selectedEndpoint?.methodType}
              </Box>
            </Flex>
          }
        />
        <Switch
          size="xs"
          label="Show Loader"
          labelPosition="left"
          {...showLoaderInputProps}
          checked={showLoaderInputProps.value}
          onChange={(event) => {
            showLoaderInputProps.onChange(event);
          }}
          sx={{ fontWeight: 500 }}
        />
        {selectedEndpoint && (
          <Stack spacing={2}>
            {[
              {
                title: "Headers",
                type: "header" as ApiType,
                items: selectedEndpoint.headers,
              },
              {
                title: "Request Body",
                type: "body" as ApiType,
                items: selectedEndpoint.requestBody,
              },
              {
                title: "Query Strings",
                type: "parameter" as ApiType,
                items: selectedEndpoint.parameters,
              },
            ].map(({ title, type, items }) => (
              <React.Fragment key={title}>
                {items.length > 0 && (
                  <Title order={5} mt="md">
                    {title}
                  </Title>
                )}
                {items.map((param) => {
                  const field = `binds.${type}.${param.name}`;
                  if (param.name === "place_id") return null;
                  return (
                    <Stack key={param.name}>
                      <ComponentToBindFromInput
                        isLogicFlow={true}
                        onPickComponent={(componentToBind: string) => {
                          form.setFieldValue(
                            field,
                            `valueOf_${componentToBind}`,
                          );
                          setComponentToBind(undefined);
                        }}
                        onPickVariable={(variable: string) => {
                          form.setFieldValue(field, variable);
                        }}
                        javascriptCode={form.values.actionCode}
                        onChangeJavascriptCode={(
                          javascriptCode: string,
                          label: string,
                        ) => {
                          const actionCode = form.values.actionCode;
                          form.setFieldValue(`actionCode`, {
                            ...actionCode,
                            [label]: javascriptCode,
                          });
                        }}
                        size="xs"
                        label={param.name}
                        description={`${
                          // @ts-ignore
                          param.location ? `${param.location} - ` : ""
                        }${param.type}`}
                        type={param.type}
                        {...form.getInputProps(field)}
                        // @ts-ignore
                        value={form.values[field] ?? undefined}
                        onChange={(e) => {
                          form.setFieldValue(field, e.currentTarget.value);
                        }}
                      />
                    </Stack>
                  );
                })}
              </React.Fragment>
            ))}
          </Stack>
        )}

        <Button type="submit" size="xs" loading={isUpdating}>
          Save
        </Button>
      </Stack>
    </>
  ) : (
    <Stack>
      <EmptyDatasourcesPlaceholder projectId={projectId} />
    </Stack>
  );
};
