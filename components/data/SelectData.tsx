import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { EndpointSelect } from "@/components/EndpointSelect";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { SidebarSection } from "@/components/SidebarSection";
import { Appearance } from "@/components/data/Appearance";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Divider, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDatabase } from "@tabler/icons-react";
import get from "lodash.get";
import { useEffect, useState } from "react";

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
      display: component.props?.display,
      dataType: component.props?.dataType ?? "static",
      initiallyOpened: component.props?.initiallyOpened ?? true,
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
    if (onLoadForm.isTouched()) {
      updateTreeComponentAttrs([component.id!], {
        onLoad: { binds: onLoadForm.values.binds },
      });
    }
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
        {form.values.dataType === "static" && (
          <>
            <SelectOptionsForm
              getValue={() => form.getInputProps("data").value}
              setFieldValue={setFormFieldValue}
            />
            <Appearance
              component={component}
              form={form}
              onChange={(value: any) => {
                form.setFieldValue("display", value as string);
                debouncedTreeUpdate(component.id, {
                  style: {
                    display: value,
                  },
                });
              }}
              debouncedTreeUpdate={debouncedTreeUpdate}
            />
          </>
        )}
        {form.values.dataType === "dynamic" && (
          <SidebarSection
            noPadding={true}
            id="data"
            initiallyOpened={form.values.initiallyOpened}
            label="Load Data"
            icon={IconDatabase}
            onClick={(id: string, opened: boolean) =>
              id === "data" && form.setFieldValue("initiallyOpened", opened)
            }
          >
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
                        staleTime: e.target.value === "" ? "0" : e.target.value,
                      });
                    }}
                    styles={{ rightSection: { right: "1.25rem" } }}
                    rightSection={
                      <Text size="xs" color="dimmed">
                        mins
                      </Text>
                    }
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
          </SidebarSection>
        )}
      </Stack>
    </form>
  );
};
