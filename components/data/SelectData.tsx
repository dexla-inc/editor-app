import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { EndpointSelect } from "@/components/EndpointSelect";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { Endpoint } from "@/requests/datasources/types";
import { useEditorStore } from "@/stores/editor";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { Component, debouncedTreeUpdate } from "@/utils/editor";
import { SegmentedControl, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

type Props = {
  component: Component;
};

type Tab = "static" | "dynamic";

export const SelectData = ({ component }: Props) => {
  const projectId = useEditorStore((state) => state.currentProjectId);
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

  const { data: endpoints } = useDataSourceEndpoints(projectId);

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(undefined);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  const exampleResponse = JSON.parse(selectedEndpoint?.exampleResponse ?? "[]");
  const actionData =
    exampleResponse.length &&
    Object.keys(exampleResponse[0])?.map((item: string) => {
      console.log(item);
      return {
        id: item,
        name: item,
      };
    });

  return (
    <form>
      <Stack spacing="xs">
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
              <EndpointSelect
                {...form.getInputProps("endpoint")}
                onChange={(selected) => {
                  form.setFieldValue("endpoint", selected!);
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
                ) => form.setFieldValue(`actionCode.${label}`, javascriptCode)}
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
      </Stack>
    </form>
  );
};
