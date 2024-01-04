import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { ActionsForm } from "@/components/actions/ActionsForm";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import { useVariable } from "@/hooks/useVariable";
import {
  getDataSourceEndpoints,
  getDataSources,
} from "@/requests/datasources/queries-noauth";
import { Endpoint } from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { FrontEndTypes } from "@/requests/variables/types";
import { useAuthStore } from "@/stores/auth";
import { useEditorStore } from "@/stores/editor";
import { APICallAction, Action } from "@/utils/actions";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ApiType } from "@/utils/dashboardTypes";
import { getComponentById } from "@/utils/editor";
import {
  Box,
  Button,
  Divider,
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

type FormValues = Omit<APICallAction, "name" | "datasource">;

type Props = {
  actionName?: string;
  id: string;
};

export const APICallActionForm = ({ id, actionName = "apiCall" }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<APICallAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const { createVariablesMutation } = useVariable();

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const sequentialTo = useEditorStore((state) => state.sequentialTo);

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

  const form = useForm<FormValues>({
    initialValues: {
      showLoader: action.action?.showLoader ?? true,
      endpoint: action.action?.endpoint,
      binds: {
        header: action.action?.binds?.header ?? {},
        parameter: action.action?.binds?.parameter ?? {},
        body: action.action?.binds?.body ?? {},
      },
      datasources: action.action?.datasources,
      isLogin: action.action?.isLogin ?? false,
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      updateActionInTree<APICallAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          endpoint: values.endpoint,
          showLoader: values.showLoader,
          datasources: dataSources.data!.results,
          binds: values.binds,
          isLogin: values.isLogin,
        },
        updateTreeComponentActions,
      });

      createVariablesMutation.mutate({
        name: `${selectedEndpoint?.methodType} ${selectedEndpoint?.relativeUrl}`,
        defaultValue: selectedEndpoint?.exampleResponse,
        type: "OBJECT" as FrontEndTypes,
        isGlobal: false,
        pageId: router.query.page,
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

  const isLogin = actionName === "login";
  useEffect(() => {
    const getEndpoints = async () => {
      const { results } = await getDataSourceEndpoints(projectId, {
        authOnly: isLogin,
      });
      setEndpoints(results);
    };

    if ((dataSources.data?.results ?? []).length > 0) {
      getEndpoints();
    }
  }, [dataSources.data, projectId, isLogin]);

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

  useAuthStore((state) => state.refreshAccessToken);
  const accessToken = useAuthStore((state) => state.getAccessToken);

  const showLoaderInputProps = form.getInputProps("showLoader");
  const isLoginInputProps = form.getInputProps("isLogin");

  return endpoints && endpoints.length > 0 ? (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <Select
            size="xs"
            label="Endpoint"
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
            label="Is Login Endpoint"
            labelPosition="left"
            {...isLoginInputProps}
            checked={isLoginInputProps.value}
            onChange={(event) => {
              isLoginInputProps.onChange(event);
            }}
            sx={{ fontWeight: 500 }}
          />
          <Switch
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
                    let additionalProps = {};
                    if (
                      param.name === "Authorization" &&
                      param.type === "BEARER"
                    ) {
                      const token = accessToken();
                      if (token) {
                        additionalProps = {
                          defaultValue: token.substring(0, 35) + "...",
                          disabled: true,
                        };
                      }
                    }

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
                            form.setFieldValue(
                              `binds.${type}.${param.name}`,
                              value,
                            );
                            setPickingComponentToBindTo(undefined);
                            setComponentToBind(undefined);
                          }}
                          onPickVariable={(variable: string) => {
                            form.setFieldValue(
                              `binds.${type}.${param.name}`,
                              variable,
                            );
                          }}
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
                          {...additionalProps}
                          {...form.getInputProps(field)}
                          {...AUTOCOMPLETE_OFF_PROPS}
                        />
                      </Stack>
                    );
                  })}
                </React.Fragment>
              ))}
            </Stack>
          )}

          <ActionButtons
            actionId={id}
            componentActions={componentActions}
            canAddSequential={true}
          />
        </Stack>
      </form>
      {sequentialTo === id && (
        <>
          <Divider my="lg" label="Sequential Action" labelPosition="center" />
          <ActionsForm sequentialTo={sequentialTo} />
        </>
      )}
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
