import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
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
        {["children", "src"].map((key) => (
          <ComponentToBindFromInput
            key={key}
            componentId={component?.id!}
            onPickVariable={(variable: string) => setFieldValue(key, variable)}
            actionData={[]}
            javascriptCode={form.values.actionCode}
            onChangeJavascriptCode={(javascriptCode: string, label: string) =>
              setFieldValue(`actionCode.${label}`, javascriptCode)
            }
            size="xs"
            label={key === "children" ? "Value" : "Source"}
            {...(key === "children"
              ? {}
              : { placeholder: "https://example.com/image.png", type: "url" })}
            {...form.getInputProps(key)}
            onChange={(e) => setFieldValue(key, e.currentTarget.value)}
            {...AUTOCOMPLETE_OFF_PROPS}
          />
        ))}
      </Stack>
    </form>
  );
};
