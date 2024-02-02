import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Endpoint } from "@/requests/datasources/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { ApiType } from "@/utils/dashboardTypes";
import { getComponentById } from "@/utils/editor";
import { Stack, Title } from "@mantine/core";
import React from "react";

type Props = {
  selectedEndpoint: Endpoint;
  form: any;
};

export const EndpointRequestInputs = ({ selectedEndpoint, form }: Props) => {
  const accessToken = useDataSourceStore(
    (state) => state.authState.accessToken,
  );
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
                  size="xs"
                  label={param.name}
                  componentId={component?.id!}
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
                  onPickComponent={() => {
                    setPickingComponentToBindTo(undefined);
                    setComponentToBind(undefined);
                  }}
                  {...form.getInputProps(field)}
                />
              </Stack>
            );
          })}
        </React.Fragment>
      ))}
    </Stack>
  );
};
