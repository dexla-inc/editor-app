import { EndpointSelect } from "@/components/EndpointSelect";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Divider, Select, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import get from "lodash.get";
import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";

function getObjectAndArrayKeys(obj: any, prefix = "") {
  let keys: string[] = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        keys.push(newKey);

        if (!Array.isArray(obj[key])) {
          keys = keys.concat(getObjectAndArrayKeys(obj[key], newKey));
        }
      }
    }
  }

  return keys;
}

export const SelectData = ({ component, endpoints }: DataProps) => {
  const form = useForm({
    initialValues: {
      data: component.props?.data ?? [],
      dataType: component.props?.dataType ?? "static",
      endpointId: component.props?.endpointId ?? undefined,
      dataLabelKey: component.props?.dataLabelKey ?? "",
      dataValueKey: component.props?.dataValueKey ?? "",
      resultsKey: component.props?.resultsKey ?? "",
    },
  });

  const endpointSettingsForm = useForm();

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(endpoints?.results?.find((e) => e.id === component.props?.endpointId));

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  const exampleResponse = JSON.parse(selectedEndpoint?.exampleResponse ?? "{}");
  const resultsKeysList = getObjectAndArrayKeys(exampleResponse);
  const selectableObject = form.values.resultsKey
    ? get(exampleResponse, form.values.resultsKey)
    : exampleResponse;
  const selectableObjectKeys = Object.keys(
    Array.isArray(selectableObject) ? selectableObject[0] : selectableObject,
  );

  return (
    <form>
      <Stack spacing="xs">
        <DataTabSelect
          {...form.getInputProps("dataType")}
          setFieldValue={setFieldValue}
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
              <EndpointSelect
                {...form.getInputProps("endpointId")}
                onChange={(selected) => {
                  const newValues = {
                    endpointId: selected,
                    dataLabelKey: "",
                    dataValueKey: "",
                    resultsKey: "",
                  };
                  form.setValues(newValues);
                  debouncedTreeUpdate(component.id, newValues);

                  setSelectedEndpoint(
                    endpoints?.results?.find((e) => e.id === selected),
                  );
                }}
              />

              {form.values.endpointId && (
                <>
                  <EndpointRequestInputs
                    selectedEndpoint={selectedEndpoint!}
                    form={endpointSettingsForm}
                  />
                  <Divider mt="md" />
                  <Title order={5} mt="xs">
                    Input Settings
                  </Title>
                  {!Array.isArray(exampleResponse) && (
                    <Select
                      clearable
                      label="Results key"
                      placeholder="user.list"
                      data={resultsKeysList}
                      {...form.getInputProps("resultsKey")}
                      onChange={(selected) => {
                        const newValues = {
                          dataLabelKey: "",
                          dataValueKey: "",
                          resultsKey: selected,
                        };
                        form.setValues(newValues);
                        debouncedTreeUpdate(component.id, newValues);
                      }}
                    />
                  )}
                  <Select
                    label="Label"
                    data={selectableObjectKeys}
                    {...form.getInputProps("dataLabelKey")}
                    onChange={(selected) => {
                      setFieldValue("dataLabelKey", selected);
                    }}
                  />
                  <Select
                    label="Value"
                    data={selectableObjectKeys}
                    {...form.getInputProps("dataValueKey")}
                    onChange={(selected) => {
                      setFieldValue("dataValueKey", selected);
                    }}
                  />
                </>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </form>
  );
};
