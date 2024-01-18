import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Appearance } from "@/components/data/Appearance";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DynamicDataSettings } from "@/components/data/DynamicDataSettings";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

export const AvatarData = ({ component, endpoints }: DataProps) => {
  const isImageComponent = component.name === "Image";
  const propsArray = isImageComponent ? ["src", "alt"] : ["children", "src"];
  const form = useForm({
    initialValues: {
      ...(!isImageComponent && { children: component.props?.children ?? "" }),
      ...(isImageComponent && { alt: component.props?.alt ?? "" }),
      src: component.props?.src ?? "",
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
            {propsArray.map((key) => (
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
                label={
                  key === "children"
                    ? "Value"
                    : key === "alt"
                    ? "Alternative Text"
                    : "Source"
                }
                {...(key === "children" || key === "alt"
                  ? {}
                  : {
                      placeholder: "https://example.com/image.png",
                      type: "url",
                    })}
                {...form.getInputProps(key)}
                onChange={(e) => setFieldValue(key, e.currentTarget.value)}
              />
            ))}
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
