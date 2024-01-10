import { Component, debouncedTreeUpdate } from "@/utils/editor";
import {
  Box,
  Flex,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import React, { forwardRef, useEffect, useState } from "react";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { useForm } from "@mantine/form";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import { useDataSourceStore } from "@/stores/datasource";
import { MethodTypes } from "@/requests/types";
import { Endpoint } from "@/requests/datasources/types";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";

type Props = {
  component: Component;
};

type Tab = "static" | "dynamic";

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
SelectItem.displayName = "SelectItem";

export const SelectData = ({ component }: Props) => {
  const form = useForm({
    initialValues: {
      data: component.props?.data ?? [],
      dataType: component.props?.dataType ?? "static",
      endpoint: component.props?.endpoint ?? undefined,
      actionCode: component.props?.actionCode ?? {},
      dataLabelKey: component.props?.dataLabelKey ?? "",
      dataValueKey: component.props?.dataValueKey ?? "",
    },
  });

  const endpoints = useDataSourceStore((state) => state.endpoints);
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(undefined);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  useEffect(() => {
    console.log(form.values);
  }, [form.values]);

  // console.log(selectedEndpoint);

  const exampleResponse = JSON.parse(selectedEndpoint?.exampleResponse ?? "[]");
  const actionData =
    exampleResponse.length &&
    Object.keys(exampleResponse[0])?.map((item: string) => {
      return {
        id: item,
        name: item,
      };
    });

  return (
    <Box>
      <Stack spacing="xs">
        <form>
          <SegmentedControl
            w="100%"
            size="xs"
            data={[
              { label: "Static", value: "static" },
              { label: "Dynamic", value: "dynamic" },
            ]}
            {...form.getInputProps("dataType")}
          />
          <Stack spacing="xs">
            {form.values.dataType === "static" && (
              <SelectOptionsForm
                getValue={() => form.getInputProps("data").value}
                setFieldValue={setFieldValue}
              />
            )}
            {form.values.dataType === "dynamic" && (
              <>
                <Select
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
                    setSelectedEndpoint(
                      endpoints?.find((e) => e.id === selected),
                    );
                  }}
                  icon={
                    <Flex>
                      <Box
                        p={2}
                        sx={{
                          fontSize: 8,
                          color: "white",
                          border:
                            selectedEndpoint?.methodType &&
                            colors[selectedEndpoint.methodType].color +
                              " 1px solid",
                          background:
                            selectedEndpoint?.methodType &&
                            colors[selectedEndpoint.methodType].color,
                          borderRadius: "4px",
                          width: 28,
                          textAlign: "center",
                        }}
                      >
                        {selectedEndpoint?.methodType}
                      </Box>
                    </Flex>
                  }
                />
                <TextInput
                  size="xs"
                  label="Results key"
                  placeholder="user.list"
                />
                <ComponentToBindFromInput
                  componentId={component?.id!}
                  onPickVariable={(variable: string) => {
                    console.log("onpickvariable");
                    form.setFieldValue("dataLabelKey", variable);
                  }}
                  actionData={actionData}
                  javascriptCode={form.values.actionCode}
                  onChangeJavascriptCode={(
                    javascriptCode: string,
                    label: string,
                  ) =>
                    form.setFieldValue(`actionCode.${label}`, javascriptCode)
                  }
                  size="xs"
                  label={"Label"}
                  {...form.getInputProps("dataLabelKey")}
                  onChange={(e) => {
                    form.setFieldValue("dataLabelKey", e.currentTarget.value);
                  }}
                  {...AUTOCOMPLETE_OFF_PROPS}
                />
                <ComponentToBindFromInput
                  componentId={component?.id!}
                  onPickVariable={(variable: string) => {
                    form.setFieldValue("dataValueKey", variable);
                  }}
                  actionData={actionData}
                  javascriptCode={{}}
                  // onChangeJavascriptCode={(
                  //   javascriptCode: string,
                  //   label: string,
                  // ) =>
                  //   form.setFieldValue(`actionCode.${label}`, javascriptCode)
                  // }
                  size="xs"
                  label={"Value"}
                  {...form.getInputProps("dataValueKey")}
                  onChange={(e) => {
                    form.setFieldValue("dataValueKey", e.currentTarget.value);
                  }}
                  {...AUTOCOMPLETE_OFF_PROPS}
                />
              </>
            )}
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};
