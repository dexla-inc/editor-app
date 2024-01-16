import { EndpointSelect } from "@/components/EndpointSelect";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import get from "lodash.get";

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

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(endpoints?.results?.find((e) => e.id === component.props?.endpointId));

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  const exampleResponse = JSON.parse(selectedEndpoint?.exampleResponse ?? "[]");
  const keysList = Object.keys(
    get(exampleResponse, `${form.values.resultsKey}[0]`, {}),
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
                  setFieldValue("endpointId", selected!);
                  setSelectedEndpoint(
                    endpoints?.results?.find((e) => e.id === selected),
                  );
                }}
              />
              <TextInput
                size="xs"
                label="Results key"
                placeholder="user.list"
                {...form.getInputProps("resultsKey")}
                onChange={(e) => {
                  setFieldValue("resultsKey", e.target.value);
                }}
              />
              <Select
                label="Label"
                data={keysList}
                {...form.getInputProps("dataLabelKey")}
                onChange={(selected) => {
                  setFieldValue("dataLabelKey", selected);
                }}
              />
              <Select
                label="Value"
                data={keysList}
                {...form.getInputProps("dataValueKey")}
                onChange={(selected) => {
                  setFieldValue("dataValueKey", selected);
                }}
              />
            </>
          )}
        </Stack>
      </Stack>
    </form>
  );
};
