import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import {
  getDataSourceEndpoints,
  getDataSources,
} from "@/requests/datasources/queries-noauth";
import { Endpoint } from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { useEditorStore } from "@/stores/editor";
import { Action, BindPlaceDataAction } from "@/utils/actions";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ApiType } from "@/utils/dashboardTypes";
import { getAllComponentsByName, getComponentById } from "@/utils/editor";
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
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
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
  id: string;
};

// TODO: This needs deleting
export const BindPlaceDataActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<BindPlaceDataAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );

  const [endpoints, setEndpoints] = useState<Array<Endpoint> | undefined>(
    undefined,
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(undefined);

  const router = useRouter();
  const projectId = router.query.id as string;

  const dataSources = useQuery({
    queryKey: ["datasources"],
    queryFn: () => getDataSources(projectId, {}),
    enabled: !!projectId,
  });

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const containers = getAllComponentsByName(editorTree.root, "Container");

  const form = useForm<FormValues>({
    // @ts-ignore
    initialValues: {
      showLoader: action.action?.showLoader ?? true,
      endpoint: action.action?.endpoint,
      selectedEndpoint: action.action?.selectedEndpoint,
      binds: {
        header: action.action?.binds?.header ?? {},
        parameter: action.action?.binds?.parameter ?? {},
        body: action.action?.binds?.body ?? {},
      },
      datasources: action.action?.datasources,
      componentId: action.action?.componentId ?? "",
      actionCode: action.action?.actionCode ?? {},
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      updateActionInTree<BindPlaceDataAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        // @ts-ignore
        updateValues: {
          endpoint: values.endpoint,
          selectedEndpoint: selectedEndpoint!,
          showLoader: values.showLoader,
          datasources: dataSources.data!.results,
          binds: values.binds,
          componentId: values.componentId!,
          actionCode: values.actionCode,
        },
        updateTreeComponentActions,
      });
      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  // For EmptyDatasourcesPlaceholder
  const removeAction = () => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== id && a.sequentialTo !== id;
      }),
    );
  };

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

  return endpoints && endpoints.length > 0 ? (
    <>
      <form
        onSubmit={
          // @ts-ignore
          form.onSubmit(onSubmit)
        }
      >
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
                    if (param.name === "place_id") return null;
                    const field = `binds.${type}.${param.name}`;
                    return (
                      <Stack key={param.name}>
                        <ComponentToBindFromInput
                          componentId={component?.id!}
                          onPickComponent={(componentToBind: string) => {
                            const value = componentToBind.startsWith(
                              "queryString_pass_",
                            )
                              ? componentToBind
                              : `valueOf_${componentToBind}`;
                            form.setFieldValue(field, value);
                            setPickingComponentToBindTo(undefined);
                            setComponentToBind(undefined);
                          }}
                          onPickVariable={(variable: string) => {
                            form.setFieldValue(field, variable);
                          }}
                          javascriptCode={form.values.actionCode}
                          onChangeJavascriptCode={(
                            javascriptCode: string,
                            label: string,
                          ) =>
                            form.setFieldValue(
                              `actionCode.${label}`,
                              javascriptCode,
                            )
                          }
                          size="xs"
                          label={param.name}
                          description={`${
                            // @ts-ignore
                            param.location ? `${param.location} - ` : ""
                          }${param.type}`}
                          type={param.type}
                          {...(param.name !== "Authorization"
                            ? // @ts-ignore
                              { required: param.required }
                            : {})}
                          {...form.getInputProps(field)}
                          onChange={(e) => {
                            form.setFieldValue(field, e.currentTarget.value);
                          }}
                          {...AUTOCOMPLETE_OFF_PROPS}
                        />
                      </Stack>
                    );
                  })}
                </React.Fragment>
              ))}
            </Stack>
          )}

          <ActionButtons actionId={id} componentActions={componentActions} />
        </Stack>
      </form>
    </>
  ) : (
    <Stack>
      <EmptyDatasourcesPlaceholder projectId={projectId} />
      <Button size="xs" type="button" variant="default" onClick={removeAction}>
        Remove
      </Button>
    </Stack>
  );
};
