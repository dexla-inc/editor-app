import { ActionButtons } from "@/components/actions/ActionButtons";
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
import { ApiType } from "@/utils/dashboardTypes";
import { getComponentById } from "@/utils/editor";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Popover,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconCurrentLocation } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { forwardRef, useEffect, useState } from "react";
import { InformationAlert } from "../Alerts";

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
  const { componentActions, action } = useActionData<
    LoginAction | APICallAction
  >({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const setPickingComponentToBindFrom = useEditorStore(
    (state) => state.setPickingComponentToBindFrom,
  );
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const pickingComponentToBindFrom = useEditorStore(
    (state) => state.pickingComponentToBindFrom,
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

  const form = useForm<FormValues>({
    initialValues: {
      showLoader: action.action.showLoader ?? true,
      endpoint: action.action.endpoint,
      binds: {
        header: action.action.binds?.header ?? {},
        parameter: action.action.binds?.parameter ?? {},
        body: action.action.binds?.body ?? {},
      },
      datasources: action.action.datasources,
    },
  });

  const currentPageId = router.query.page;
  const currentPage = useEditorStore((state) =>
    state.pages.find((page) => page.id === currentPageId),
  );

  const featureToBindTo = useEditorStore((state) => state.featureToBindTo);
  const setFeatureToBindTo = useEditorStore(
    (state) => state.setFeatureToBindTo,
  );

  const [selectedParam, setSelectedParam] = useState<string | undefined>(
    undefined,
  );
  const [isFeaturesOpen, { toggle, close }] = useDisclosure(false);
  const [feature, setFeature] = useState<Feature>(null!);
  const [isFeaturesArrayEmpty, setIsFeaturesArrayEmpty] =
    useState<boolean>(true);
  const [isFeatureError, setIsFeatureError] = useState<boolean>(false);

  const queries = useForm({
    initialValues: {
      featuresObj: {} as Record<string, string>,
      keys: [] as string[],
      selectedKey: "",
      feature: ["Query Strings", "Languages"] as Feature[],
      selectedValue: "",
      param: "",
    },
  });

  const handleFeature = (featureItem: Feature) => {
    setFeature(featureItem);
    const featureWithoutSpaces = featureItem.replace(/\s+/g, "");
    const feature =
      featureWithoutSpaces.charAt(0).toLowerCase() +
      featureWithoutSpaces.slice(1);
    if (currentPage) {
      if (Object.keys(currentPage).includes(feature)) {
        const currentPageFeatures = currentPage[feature];
        const featuresArray = Object.keys(currentPageFeatures);
        const isFeaturesArrayEmpty = featuresArray.length === 0;
        setIsFeaturesArrayEmpty(isFeaturesArrayEmpty);
        if (isFeaturesArrayEmpty) {
          setIsFeatureError(true);
          close();
        }
        if (currentPageFeatures !== undefined && !isFeaturesArrayEmpty) {
          queries.setFieldValue("keys", featuresArray);
          queries.setFieldValue("featuresObj", currentPageFeatures);
        }
      } else {
        setIsFeatureError(true);
      }
    }
  };

  useEffect(() => {
    if (featureToBindTo) {
      form.setFieldValue(
        `binds.${featureToBindTo.paramType}.typeKey_${featureToBindTo.key}`,
        `queryString_pass_${featureToBindTo.value}`,
      );
      queries.setFieldValue("param", featureToBindTo.param as string);
      setFeatureToBindTo(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureToBindTo]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      isFeatureError && setIsFeatureError(false);
    }, 5000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature, isFeatureError]);

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      updateActionInTree<LoginAction | APICallAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          endpoint: values.endpoint,
          showLoader: values.showLoader,
          datasources: dataSources.data!.results,
          binds: values.binds,
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
    if (componentToBind && pickingComponentToBindFrom) {
      if (pickingComponentToBindFrom.componentId === component?.id) {
        form.setFieldValue(
          `binds.${pickingComponentToBindFrom.paramType}.${pickingComponentToBindFrom.param}`,
          `valueOf_${componentToBind}`,
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
        endpoints?.find((e) => e.id === form.values.endpoint),
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
                    const itemProps =
                      param.name === queries.values.param
                        ? form.getInputProps(
                            `binds.typeKey_${queries.values.selectedKey}`,
                          )
                        : form.getInputProps(`binds.${type}.${param.name}`);

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
                          {...itemProps}
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
                                    paramType: type,
                                    bindedId:
                                      form.values.binds?.[type][param.name] ??
                                      "",
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
                            {!isFeaturesArrayEmpty && (
                              <Popover.Dropdown>
                                <Stack>
                                  {queries.values.keys.map((value) => (
                                    <Text
                                      fz="sm"
                                      sx={{ cursor: "pointer" }}
                                      onClick={() => {
                                        const featureValue =
                                          queries.values.featuresObj[value];
                                        setFeatureToBindTo({
                                          key: value,
                                          value: featureValue,
                                          trigger: action.trigger,
                                          endpointId: selectedEndpoint.id,
                                          param: param.name,
                                          paramType: type,
                                          bindedId:
                                            form.values.binds?.[type][
                                              param.name
                                            ] ?? "",
                                        });
                                        queries.setFieldValue(
                                          "selectedKey",
                                          value,
                                        );
                                        queries.setFieldValue(
                                          "selectedValue",
                                          featureValue,
                                        );
                                        close();
                                      }}
                                      key={value}
                                    >
                                      {value}
                                    </Text>
                                  ))}
                                </Stack>
                              </Popover.Dropdown>
                            )}
                          </Popover>
                        )}
                      </Stack>
                    );
                  })}
                </React.Fragment>
              ))}
            </Stack>
          )}
          {isFeatureError && (
            <InformationAlert
              title="Empty strings!"
              text={`add ${feature.toLowerCase()} to page`}
            />
          )}
          <ActionButtons
            actionId={id}
            componentActions={componentActions}
            canAddSequential={true}
          />
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
