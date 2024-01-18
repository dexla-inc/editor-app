import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Appearance } from "@/components/data/Appearance";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DynamicDataSettings } from "@/components/data/DynamicDataSettings";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Checkbox, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

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
      dataType: component.props?.dataType ?? "static",
      initiallyOpened: true,
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
            <Appearance
              component={component}
              form={form}
              debouncedTreeUpdate={debouncedTreeUpdate}
            />
          </>
        )}
        {form.values.dataType === "dynamic" && (
          <DynamicDataSettings
            initiallyOpened={form.values.initiallyOpened}
            onClick={(id: string, opened: boolean) =>
              id === "data" && form.setFieldValue("initiallyOpened", opened)
            }
            onChange={(selected) => {
              setFieldValue("endpoint", selected!);
              setSelectedEndpoint(
                endpoints?.results?.find((e) => e.id === selected),
              );
            }}
            endpointSelectProps={form.getInputProps("endpoint")}
          />
        )}
      </Stack>
    </form>
  );
};
