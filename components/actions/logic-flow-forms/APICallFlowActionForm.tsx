import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import {
  getDataSourceEndpoints,
  getDataSources,
} from "@/requests/datasources/queries";
import { Endpoint } from "@/requests/datasources/types";
import { getPage } from "@/requests/pages/queries";
import { MethodTypes } from "@/requests/types";
import { useAuthStore } from "@/stores/auth";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { APICallAction, LoginAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { ApiType } from "@/utils/dashboardTypes";
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

type FormValues = Omit<APICallAction | LoginAction, "name" | "datasource">;

type Props = {
  actionName?: string;
  form: UseFormReturnType<FormValues>;
};

export const APICallFlowActionForm = ({
  form,
  actionName = "apiCall",
}: Props) => {
  const { setComponentToBind, setTree } = useEditorStore();
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const [endpoints, setEndpoints] = useState<Array<Endpoint> | undefined>(
    undefined,
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(undefined);

  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const dataSources = useQuery({
    queryKey: ["datasources"],
    queryFn: () => getDataSources(projectId, {}),
    enabled: !!projectId,
  });

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

  const { data: page } = useQuery({
    queryKey: ["page", projectId, pageId],
    queryFn: async () => {
      return await getPage(projectId, pageId);
    },
    enabled: !!projectId && !!pageId,
  });

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

                  const field = `binds.${type}.${param.name}`;

                  return (
                    <Stack key={param.name}>
                      <ComponentToBindFromInput
                        onPick={(componentToBind: string) => {
                          form.setFieldValue(
                            `binds.${type}.${param.name}`,
                            `valueOf_${componentToBind}`,
                          );
                          setComponentToBind(undefined);
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
                        autoComplete="off"
                        data-lpignore="true"
                        data-form-type="other"
                        {...form.getInputProps(field)}
                        // @ts-ignore
                        value={form.values[field] ?? undefined}
                        onChange={(e) => {
                          form.setValues({
                            ...form.values,
                            [field]: e.currentTarget.value,
                          });
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
