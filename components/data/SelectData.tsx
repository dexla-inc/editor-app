import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { EndpointSelect } from "@/components/EndpointSelect";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useEditorStore } from "@/stores/editor";
import { DataResponse } from "@/stores/fetchedData";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { Component, debouncedTreeUpdate } from "@/utils/editor";
import { SegmentedControl, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

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
  const selectedComponentIds = useEditorStore(
    (state) => state.selectedComponentIds,
  );

  const getSelectedEndpoint = (selected: any) =>
    endpoints?.results.find((e) => e.id === selected);

  const [dataResponse, setdataResponse] = useState<DataResponse | undefined>(
    undefined,
  );

  useEffect(() => {
    setdataResponse(getdataResponse(form.values.endpoint));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataList, form.values.endpoint]);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(selectedComponentIds, { [key]: value });
  };

  const actiondataResponse =
    dataResponse && JSON.parse(dataResponse["exampleResponse"]);

  const updatedataResponseArray = (key: string, value: string) => {
    const _dataResponse = actiondataResponse.map((item: any) => {
      return {
        label: item[key],
        value: item[value],
      };
    });
    setFieldValue("data", _dataResponse);
  };

  const allowUpdate = !!form.values.dataLabelKey && !!form.values.dataValueKey;
  useEffect(() => {
    allowUpdate &&
      updatedataResponseArray(
        form.values.dataLabelKey,
        form.values.dataValueKey,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.dataLabelKey, form.values.dataValueKey]);

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
          onChange={(value) => {
            setFieldValue("dataType", value);
          }}
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
                  setFieldValue("dataLabelKey", variable);
                }}
                actionData={{}}
                javascriptCode={form.values.actionCode}
                onChangeJavascriptCode={(
                  javascriptCode: string,
                  label: string,
                ) => setFieldValue(`actionCode.${label}`, javascriptCode)}
                size="xs"
                label={"Label"}
                {...form.getInputProps("dataLabelKey")}
                onChange={(e) => {
                  setFieldValue("dataLabelKey", e.currentTarget.value);
                }}
                {...AUTOCOMPLETE_OFF_PROPS}
              />
              <ComponentToBindFromInput
                componentId={component?.id!}
                onPickVariable={(variable: string) => {
                  setFieldValue("dataValueKey", variable);
                }}
                actionData={actiondataResponse}
                javascriptCode={form.values.actionCode}
                onChangeJavascriptCode={(
                  javascriptCode: string,
                  label: string,
                ) => setFieldValue(`actionCode.${label}`, javascriptCode)}
                size="xs"
                label={"Value"}
                {...form.getInputProps("dataValueKey")}
                onChange={(e) => {
                  setFieldValue("dataValueKey", e.currentTarget.value);
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
