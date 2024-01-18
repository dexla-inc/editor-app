import { EndpointSelect } from "@/components/EndpointSelect";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Divider, Select, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import get from "lodash.get";
import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";

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
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const setInputValue = useInputsStore((state) => state.setInputValue);
  const form = useForm({
    initialValues: {
      data: component.props?.data ?? [],
      dataType: component.props?.dataType ?? "static",
    },
  });

  const onLoadForm = useForm({
    initialValues: {
      endpointId: component.onLoad?.endpointId ?? undefined,
      dataLabelKey: component.onLoad?.dataLabelKey ?? "",
      dataValueKey: component.onLoad?.dataValueKey ?? "",
      resultsKey: component.onLoad?.resultsKey ?? "",
      actionCode: component.onLoad?.actionCode ?? {},
      staleTime: component.onLoad?.staleTime ?? "30",
      binds: {
        header: component.onLoad?.binds?.header ?? {},
        parameter: component.onLoad?.binds?.parameter ?? {},
        body: component.onLoad?.binds?.body ?? {},
      },
    },
  });

  useEffect(() => {
    updateTreeComponentAttrs([component.id!], {
      onLoad: { binds: onLoadForm.values.binds },
    });
  }, [onLoadForm.values.binds]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(endpoints?.results?.find((e) => e.id === component.onLoad?.endpointId));

  const setFormFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  const setOnLoadFormFieldValue = (attrs: any) => {
    onLoadForm.setValues(attrs);
    updateTreeComponentAttrs([component.id!], { onLoad: attrs });
  };

  const exampleResponse = JSON.parse(selectedEndpoint?.exampleResponse ?? "{}");
  const resultsKeysList = getObjectAndArrayKeys(exampleResponse);
  const selectableObject = onLoadForm.values.resultsKey
    ? get(exampleResponse, onLoadForm.values.resultsKey)
    : exampleResponse;
  const selectableObjectKeys = Object.keys(
    Array.isArray(selectableObject) ? selectableObject[0] : selectableObject,
  );

  return (
    <form>
      <Stack spacing="xs">
        <DataTabSelect
          {...form.getInputProps("dataType")}
          setFieldValue={setFormFieldValue}
        />
        <Stack spacing="xs">
          {form.values.dataType === "static" && (
            <SelectOptionsForm
              getValue={() => form.getInputProps("data").value}
              setFieldValue={setFormFieldValue}
            />
          )}
          {form.values.dataType === "dynamic" && (
            <>
              <EndpointSelect
                {...onLoadForm.getInputProps("endpointId")}
                onChange={(selected) => {
                  const newValues = {
                    endpointId: selected,
                    dataLabelKey: "",
                    dataValueKey: "",
                    resultsKey: "",
                  };
                  setOnLoadFormFieldValue(newValues);
                  setInputValue(component.id!, "");

                  setSelectedEndpoint(
                    endpoints?.results?.find((e) => e.id === selected),
                  );
                }}
              />

              {onLoadForm.values.endpointId && (
                <>
                  <SegmentedControlInput
                    label="Cache Request"
                    value={onLoadForm.values.staleTime === "0" ? "No" : "Yes"}
                    data={["Yes", "No"]}
                    onChange={(value) => {
                      setOnLoadFormFieldValue({
                        staleTime: value === "No" ? "0" : "30",
                      });
                    }}
                  />
                  {onLoadForm.values.staleTime !== "0" && (
                    <TextInput
                      {...onLoadForm.getInputProps("staleTime")}
                      onChange={(e) => {
                        setOnLoadFormFieldValue({
                          staleTime:
                            e.target.value === "" ? "0" : e.target.value,
                        });
                      }}
                      styles={{ rightSection: { right: "1.25rem" } }}
                      rightSection={<>minutes</>}
                    />
                  )}
                  <EndpointRequestInputs
                    selectedEndpoint={selectedEndpoint!}
                    form={onLoadForm}
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
                      {...onLoadForm.getInputProps("resultsKey")}
                      onChange={(selected) => {
                        const newValues = {
                          dataLabelKey: "",
                          dataValueKey: "",
                          resultsKey: selected,
                        };
                        setInputValue(component.id!, "");
                        setOnLoadFormFieldValue(newValues);
                      }}
                    />
                  )}
                  <Select
                    label="Label"
                    data={selectableObjectKeys}
                    {...onLoadForm.getInputProps("dataLabelKey")}
                    onChange={(selected) => {
                      setOnLoadFormFieldValue({ dataLabelKey: selected });
                    }}
                  />
                  <Select
                    label="Value"
                    data={selectableObjectKeys}
                    {...onLoadForm.getInputProps("dataValueKey")}
                    onChange={(selected) => {
                      setOnLoadFormFieldValue({ dataValueKey: selected });
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
