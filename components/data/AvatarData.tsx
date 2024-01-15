import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ComponentToBindFromInput } from "../ComponentToBindFromInput";
import { EndpointSelect } from "../EndpointSelect";

export const AvatarData = ({ component, endpoints }: DataProps) => {
  const form = useForm({
    initialValues: {
      children: component.props?.children ?? "",
      src: component.props?.src ?? "",
      hideIfDataIsEmpty: component.props?.hideIfDataIsEmpty ?? false,
      dataType: component.props?.dataType ?? "static",
      endpoint: component.props?.endpoint ?? undefined,
      actionCode: component.props?.actionCode ?? {},
      valueKey: component.props?.valueKey ?? "",
      sourceKey: component.props?.sourceKey ?? "",
    },
  });

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(form.values.endpoint);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  return (
    <form>
      <Stack spacing="xs">
        <DataTabSelect
          {...form.getInputProps("dataType")}
          setFieldValue={setFieldValue}
        />
        {form.values.dataType === "static" && (
          <>
            <Textarea
              autosize
              label="Value"
              size="xs"
              {...form.getInputProps("children")}
              onChange={(e) => setFieldValue("children", e.target.value)}
            />
            <TextInput
              label="Source"
              placeholder="https://example.com/image.png"
              type="url"
              size="xs"
              {...form.getInputProps("src")}
              onChange={(e) => setFieldValue("src", e.target.value)}
            />
          </>
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
            <TextInput size="xs" label="Results key" placeholder="user.list" />
            {["valueKey", "sourceKey"].map((key) => (
              <ComponentToBindFromInput
                key={key}
                componentId={component?.id!}
                onPickVariable={(variable: string) =>
                  setFieldValue(key, variable)
                }
                actionData={[]}
                javascriptCode={form.values.actionCode}
                onChangeJavascriptCode={(
                  javascriptCode: string,
                  label: string,
                ) => setFieldValue(`actionCode.${label}`, javascriptCode)}
                size="xs"
                label={key === "valueKey" ? "Value" : "Source"}
                {...form.getInputProps(key)}
                onChange={(e) => setFieldValue(key, e.currentTarget.value)}
                {...AUTOCOMPLETE_OFF_PROPS}
              />
            ))}
          </>
        )}
      </Stack>
    </form>
  );
};
