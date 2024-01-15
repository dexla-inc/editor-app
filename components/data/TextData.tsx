import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Checkbox, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ComponentToBindFromInput } from "../ComponentToBindFromInput";
import { EndpointSelect } from "../EndpointSelect";

export const TextData = ({ component, endpoints }: DataProps) => {
  const isTextComponent = component.name === "Text";
  const isNavLink = component.name === "NavLink";
  const isFileButton = component.name === "FileButton";

  const itemKey = isNavLink ? "label" : isFileButton ? "name" : "children";

  const form = useForm({
    initialValues: {
      [itemKey]: component.props?.[itemKey] ?? "",
      hideIfDataIsEmpty: component.props?.hideIfDataIsEmpty ?? false,
      endpoint: component.props?.endpoint ?? undefined,
      actionCode: component.props?.actionCode ?? {},
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
        <ComponentToBindFromInput
          componentId={component?.id!}
          onPickVariable={(variable: string) =>
            setFieldValue(itemKey, variable)
          }
          actionData={[]}
          javascriptCode={form.values.actionCode}
          onChangeJavascriptCode={(javascriptCode: string, label: string) =>
            setFieldValue(`actionCode.${label}`, javascriptCode)
          }
          size="xs"
          label="Value"
          {...form.getInputProps(itemKey)}
          onChange={(e) => setFieldValue(itemKey, e.currentTarget.value)}
          {...AUTOCOMPLETE_OFF_PROPS}
        />
        {isTextComponent && (
          <Checkbox
            size="xs"
            label="Hide text when data is empty"
            {...form.getInputProps("hideIfDataIsEmpty", {
              type: "checkbox",
            })}
            onChange={(e) =>
              setFieldValue("hideIfDataIsEmpty", e.target.checked)
            }
          />
        )}
      </Stack>
    </form>
  );
};
