import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { EndpointSelect } from "@/components/EndpointSelect";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

type Tab = "static" | "dynamic";

export const SelectData = ({ component, endpoints }: DataProps) => {
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

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(form.values.endpoint);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

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
                {...form.getInputProps("endpoint")}
                onChange={(selected) => {
                  setFieldValue("endpoint", selected!);
                  setSelectedEndpoint(
                    endpoints?.results?.find((e) => e.id === selected),
                  );
                }}
              />
              <TextInput
                size="xs"
                label="Results key"
                placeholder="user.list"
              />
              {["dataLabelKey", "dataValueKey"].map((key) => (
                <ComponentToBindFromInput
                  key={key}
                  componentId={component?.id!}
                  onPickVariable={(variable: string) =>
                    setFieldValue(key, variable)
                  }
                  actionData={actionData}
                  javascriptCode={form.values.actionCode}
                  onChangeJavascriptCode={(
                    javascriptCode: string,
                    label: string,
                  ) => setFieldValue(`actionCode.${label}`, javascriptCode)}
                  size="xs"
                  label={key === "dataLabelKey" ? "Label" : "Value"}
                  {...form.getInputProps(key)}
                  onChange={(e) => setFieldValue(key, e.currentTarget.value)}
                  {...AUTOCOMPLETE_OFF_PROPS}
                />
              ))}
            </>
          )}
        </Stack>
      </Stack>
    </form>
  );
};
