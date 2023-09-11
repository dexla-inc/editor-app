import { ActionButtons } from "@/components/actions/ActionButtons";
import { ActionsForm } from "@/components/actions/ActionsForm";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import {
  getDataSourceEndpoints,
  getDataSources,
} from "@/requests/datasources/queries";
import { Endpoint } from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { useAuthStore } from "@/stores/auth";
import { useEditorStore } from "@/stores/editor";
import { APICallAction, Action, LoginAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Flex,
  Popover,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconChevronDown,
  IconCurrentLocation,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

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
  )
);

type FormValues = Omit<APICallAction | LoginAction, "name" | "datasource">;

type Props = {
  actionName?: string;
  id: string;
};

type Feature = "Query Strings" | "Languages";

export const APICallActionForm = ({ id, actionName = "apiCall" }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const {
    componentActions,
    action: baseAction,
    action,
  } = useActionData<LoginAction | APICallAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const setPickingComponentToBindFrom = useEditorStore(
    (state) => state.setPickingComponentToBindFrom
  );
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const pickingComponentToBindFrom = useEditorStore(
    (state) => state.pickingComponentToBindFrom
  );

  const [endpoints, setEndpoints] = useState<Array<Endpoint> | undefined>(
    undefined
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
      showLoader: action.action.showLoader ?? true,
      endpoint: action.action.endpoint,
      binds: action.action.binds ?? {},
    },
  });

  const queryStrings = useEditorStore((state) => state.pages);
  const queryStringsArray = queryStrings
    .map((page) => page.queryStrings)
    .filter((item) => Object.keys(item as { [i: string]: string }).length > 0);
  const isQueryEmpty = queryStringsArray.length === 0;

  const setQueryToBindTo = useEditorStore((state) => state.setQueryToBindTo);

  const [selectedParam, setSelectedParam] = useState<string | undefined>(
    undefined
  );
  const [isFeaturesOpen, { toggle, close }] = useDisclosure(false);
  const [feature, setFeature] = useState<Feature>(null!);
  const [isQuerryError, setIsQuerryError] = useState<boolean>(false);

  const queries = useForm({
    initialValues: {
      keys: [] as string[],
      selectedQuery: "",
      feature: ["Query Strings", "Languages"] as Feature[],
      selectQueryValue: "",
    },
  });

  useEffect(() => {
    const queryStringsArray = queryStrings
      .map((page) => page.queryStrings)
      .filter(
        (item) => Object.keys(item as { [i: string]: string }).length > 0
      );
    const queriesKeys = queryStringsArray.map((query) =>
      Object.keys(query as { [i: string]: string })
    );
    const mappedQueryKeys = queriesKeys.reduce(
      (query, arr) => [...arr, ...query],
      []
    );
    queries.setFieldValue("keys", mappedQueryKeys);
    if (!isQueryEmpty) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryStrings]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      isQuerryError && setIsQuerryError(false);
    }, 5000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature, isQuerryError]);

  const handleFeature = (featureItem: Feature) => {
    setFeature(featureItem);
    isQueryEmpty && setIsQuerryError(true);
  };

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      const { selectedQuery, selectQueryValue } = queries.values;

      updateActionInTree<LoginAction | APICallAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          endpoint: values.endpoint,
          showLoader: values.showLoader,
          datasource: dataSources.data!.results[0],
          binds: { ...values.binds, [selectedQuery]: selectQueryValue },
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
      })
    );
  };

  const isLogin = actionName === "login";
  useEffect(() => {
    const getEndpoints = async () => {
      const { results } = await getDataSourceEndpoints(
        projectId,
        dataSources.data!.results[0].id,
        { authOnly: isLogin }
      );
      setEndpoints(results);
    };

    if ((dataSources.data?.results ?? []).length > 0) {
      getEndpoints();
    }
  }, [dataSources.data, projectId, isLogin]);

  useEffect(() => {
    if (componentToBind && pickingComponentToBindFrom) {
      if (pickingComponentToBindFrom.componentId === component?.id) {
        form.setFieldValue(
          `binds.${pickingComponentToBindFrom.param}`,
          `valueOf_${componentToBind}`
        );

        setPickingComponentToBindFrom(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component?.id, componentToBind, pickingComponentToBindFrom]);

  useEffect(() => {
    if (
      form.values.endpoint &&
      !selectedEndpoint &&
      (endpoints ?? [])?.length > 0
    ) {
      setSelectedEndpoint(
        endpoints?.find((e) => e.id === form.values.endpoint)
      );
    }
  }, [endpoints, form.values.endpoint, selectedEndpoint]);

  useAuthStore((state) => state.refreshAccessToken);
  const accessToken = useAuthStore((state) => state.getAccessToken);

  const showLoaderInputProps = form.getInputProps("showLoader");

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
                ...selectedEndpoint.headers,
                ...selectedEndpoint.requestBody,
                ...selectedEndpoint.parameters,
              ].map((param) => {
                let additionalProps = {};

                if (param.name === "Authorization" && param.type === "BEARER") {
                  const token = accessToken();
                  if (token) {
                    additionalProps = {
                      defaultValue: token.substring(0, 35) + "...",
                      disabled: true,
                    };
                  }
                }

                return (
                  <Stack key={param.name}>
                    <TextInput
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
                      {...form.getInputProps(`binds.${param.name}`)}
                      {...additionalProps}
                      rightSectionWidth="auto"
                      rightSection={
                        <Box sx={{ display: "flex" }}>
                          <ActionIcon
                            onClick={() => {
                              setPickingComponentToBindFrom({
                                componentId: component?.id!,
                                trigger: action.trigger,
                                endpointId: selectedEndpoint.id,
                                param: param.name,
                                bindedId: form.values.binds?.[param.name] ?? "",
                              });
                            }}
                          >
                            <IconCurrentLocation size={ICON_SIZE} />
                          </ActionIcon>
                          <ActionIcon
                            onClick={() => {
                              setSelectedParam(param.name);
                              toggle();
                            }}
                          >
                            <IconChevronDown size={ICON_SIZE} />
                          </ActionIcon>
                        </Box>
                      }
                      autoComplete="off"
                      data-lpignore="true"
                      data-form-type="other"
                    />
                    {isFeaturesOpen && param.name === selectedParam && (
                      <Popover withArrow shadow="md" width="100%">
                        <Popover.Target>
                          <Stack
                            spacing="xs"
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "5px",
                            }}
                          >
                            {queries.values.feature.map((featureItem) => (
                              <Button
                                key={featureItem}
                                onClick={() => handleFeature(featureItem)}
                                size="xs"
                                variant="subtle"
                                color="gray"
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                {featureItem}
                              </Button>
                            ))}
                          </Stack>
                        </Popover.Target>
                        {!isQueryEmpty && (
                          <Popover.Dropdown>
                            {feature === "Query Strings" && (
                              <Stack>
                                {queries.values.keys.map((value) => (
                                  <Text
                                    fz="sm"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                      const queryValue = queryStringsArray.find(
                                        (item) =>
                                          (item as Record<string, string>)[
                                            value
                                          ]
                                      )![value];
                                      setQueryToBindTo({
                                        queryKey: value,
                                        queryValue,
                                        trigger: action.trigger,
                                        endpointId: selectedEndpoint.id,
                                        param: param.name,
                                        bindedId:
                                          form.values.binds?.[param.name] ?? "",
                                      });
                                      queries.setFieldValue(
                                        "selectedQuery",
                                        value
                                      );
                                      queries.setFieldValue(
                                        "selectQueryValue",
                                        queryValue
                                      );
                                      close();
                                    }}
                                    key={value}
                                  >
                                    {value}
                                  </Text>
                                ))}
                              </Stack>
                            )}
                          </Popover.Dropdown>
                        )}
                      </Popover>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          )}
          {feature === "Query Strings" && isQuerryError && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Error!"
              color="red"
            >
              Add query string(s) to pages(s)
            </Alert>
          )}
          <ActionButtons
            actionId={id}
            componentActions={componentActions}
            selectedComponentId={selectedComponentId}
          ></ActionButtons>
        </Stack>
      </form>
      <ActionsForm sequentialTo={id} />
    </>
  ) : (
    <Stack>
      <EmptyDatasourcesPlaceholder
        projectId={projectId}
      ></EmptyDatasourcesPlaceholder>
      <Button size="xs" type="button" variant="default" onClick={removeAction}>
        Remove
      </Button>
    </Stack>
  );
};
