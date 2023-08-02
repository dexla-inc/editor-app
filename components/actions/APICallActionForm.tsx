import { ActionsForm } from "@/components/actions/ActionsForm";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import {
  getDataSourceEndpoints,
  getDataSources,
} from "@/requests/datasources/queries";
import { Endpoint } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { useEditorStore } from "@/stores/editor";
import { APICallAction, Action, LoginAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, any>(
  ({ method, label, ...others }: any, ref) => (
    <Flex ref={ref} gap="xs" {...others}>
      <Box
        p={2}
        sx={{
          fontSize: 8,
          color: "white",
          // @ts-ignore
          border: colors[method].color + " 1px solid",
          // @ts-ignore
          background: colors[method].color,
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

type FormValues = {
  endpoint?: string;
  binds?: { [key: string]: any };
};

type Props = {
  actionName?: string;
  id: string;
};

export const APICallActionForm = ({ id, actionName = "apiCall" }: Props) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setPickingComponentToBindFrom = useEditorStore(
    (state) => state.setPickingComponentToBindFrom
  );
  const editorTree = useEditorStore((state) => state.tree);
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const pickingComponentToBindFrom = useEditorStore(
    (state) => state.pickingComponentToBindFrom
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
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
  const componentActions = component?.props?.actions ?? [];

  const action: Action = componentActions.find((a: Action) => a.id === id);

  const apiCall = action.action as LoginAction | APICallAction;

  const form = useForm<FormValues>({
    initialValues: {
      endpoint: apiCall.endpoint,
      binds: apiCall.binds ?? {},
    },
  });

  const onSubmit = (values: any) => {
    try {
      startLoading({
        id: "saving-action",
        title: "Saving Action",
        message: "Wait while we save your changes",
      });

      updateTreeComponent(selectedComponentId!, {
        actions: componentActions.map((action: Action) => {
          if (action.id === id) {
            return {
              ...action,
              action: {
                ...action.action,
                endpoint: values.endpoint,
                datasource: dataSources.data!.results[0],
                binds: values.binds,
              },
            };
          }

          return action;
        }),
      });

      stopLoading({
        id: "saving-action",
        title: "Action Saved",
        message: "Your changes were saved successfully",
      });
    } catch (error) {
      stopLoading({
        id: "saving-action",
        title: "Failed",
        message: "Oops, something went wrong while saving your changes",
        isError: true,
      });
    }
  };

  const removeAction = () => {
    updateTreeComponent(selectedComponentId!, {
      actions: componentActions.filter((a: Action) => {
        return a.id !== action.id;
      }),
    });
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

  return (
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
                  <TextInput
                    size="xs"
                    label={param.name}
                    description={`${
                      // @ts-ignore
                      param.location ? `${param.location} - ` : ""
                    }${param.type}`}
                    key={param.name}
                    type={param.type}
                    // @ts-ignore
                    required={param.required}
                    {...form.getInputProps(`binds.${param.name}`)}
                    {...additionalProps}
                    rightSection={
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
                    }
                    autoComplete="off"
                  />
                );
              })}
            </Stack>
          )}
          <Button size="xs" type="submit">
            Save
          </Button>
          <Button
            size="xs"
            type="button"
            variant="default"
            onClick={removeAction}
          >
            Remove
          </Button>
        </Stack>
      </form>
      <ActionsForm sequentialTo={action.id} />
    </>
  );
};
