import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { EndpointSelect } from "@/components/EndpointSelect";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useRequestProp } from "@/hooks/useRequestProp";
import { Endpoint } from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { APICallAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { ApiType } from "@/utils/dashboardTypes";
import { Box, Button, Flex, Stack, Switch, Text, Title } from "@mantine/core";
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

type FormValues = Omit<APICallAction, "name" | "datasource">;

type Props = {
  actionName?: string;
  form: UseFormReturnType<FormValues>;
};

export const APICallFlowActionForm = ({ form }: Props) => {
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setTree = useEditorStore((state) => state.setTree);
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(undefined);

  const router = useRouter();
  const projectId = router.query.id as string;
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );

  const { page } = useRequestProp();

  useEffect(() => {
    if (
      form.values.endpoint &&
      !selectedEndpoint &&
      (endpoints?.results ?? [])?.length > 0
    ) {
      const selectedEndpoint = endpoints?.results?.find(
        (e) => e.id === form.values.endpoint,
      );
      setSelectedEndpoint(selectedEndpoint);
    }
  }, [endpoints, form.values.endpoint, selectedEndpoint]);

  useEffect(() => {
    if (endpoints?.results) {
      setApiAuthConfig(endpoints.results);
    }
  }, [endpoints?.results]);

  const accessToken = useDataSourceStore(
    (state) => state.authState.accessToken,
  );

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return endpoints && endpoints.results.length > 0 ? (
    <>
      <Stack spacing="xs">
        <EndpointSelect
          {...form.getInputProps("endpoint")}
          onChange={(selected) => {
            form.setFieldValue("endpoint", selected!);
            setSelectedEndpoint(
              endpoints?.results.find((e) => e.id === selected),
            );
          }}
        />
        <Switch
          label="Is Login Endpoint"
          labelPosition="left"
          {...form.getInputProps("isLogin", { type: "checkbox" })}
          sx={{ fontWeight: 500 }}
        />
        <Switch
          label="Show Loader"
          labelPosition="left"
          {...form.getInputProps("showLoader", { type: "checkbox" })}
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
                    if (accessToken) {
                      additionalProps = {
                        defaultValue: accessToken.substring(0, 35) + "...",
                        disabled: true,
                      };
                    }
                  }

                  const field = `binds.${type}.${param.name}`;

                  return (
                    <Stack key={param.name}>
                      <ComponentToBindFromInput
                        isLogicFlow={true}
                        onPickComponent={(componentToBind: string) => {
                          form.setValues({
                            ...form.values,
                            [field]: `valueOf_${componentToBind}`,
                          });
                          setPickingComponentToBindTo(undefined);
                          setComponentToBind(undefined);
                        }}
                        onPickVariable={(variable: string) => {
                          form.setValues({
                            ...form.values,
                            [field]: variable,
                          });
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
                        {...(param.name !== "Authorization"
                          ? // @ts-ignore
                            { required: param.required }
                          : {})}
                        {...additionalProps}
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
