import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Endpoint } from "@/requests/datasources/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ApiType } from "@/utils/dashboardTypes";
import { getComponentById } from "@/utils/editor";
import { Stack, Title } from "@mantine/core";
import React from "react";

type Props = {
  selectedEndpoint: Endpoint;
  form: any;
  isLogicFlow?: boolean;
};

export const EndpointRequestInputs = ({
  selectedEndpoint,
  form,
  isLogicFlow,
}: Props) => {
  const accessToken = useDataSourceStore((state) => state.accessToken);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);

  return (
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
            if (param.name === "Authorization" && param.type === "BEARER") {
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
                    form.setFieldValue(`actionCode.${label}`, javascriptCode)
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
                  {...additionalProps}
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
  );
};
