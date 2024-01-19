import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { DataTabSelect } from "@/components/data/DataTabSelect";
import { DynamicDataSettings } from "@/components/data/DynamicDataSettings";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { Endpoint } from "@/requests/datasources/types";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export const AvatarData = ({ component, endpoints }: DataProps) => {
  const { getSelectedVariable, variablesList } = useBindingPopover();
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

  const onLoadForm = useForm<Record<string, string>>({
    initialValues: {
      srcKey: component.onLoad?.srcKey ?? "",
      altKey: component.onLoad?.altKey ?? "",
      childrenKey: component.onLoad?.childrenKey ?? "",
    },
  });

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(form.values.endpoint);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  const handleValueUpdate = () => {
    let updates = {} as Record<string, string | null>;

    propsArray.forEach((propKey) => {
      const selectedVariableKey = `${propKey}Key`;
      const selectedVariable = getSelectedVariable(
        onLoadForm.values[selectedVariableKey],
      );
      if (selectedVariable) {
        updates[propKey] = selectedVariable.defaultValue;
        form.setFieldValue(propKey, selectedVariable.defaultValue);
      }
    });

    debouncedTreeUpdate(component.id, updates);
    // if (Object.keys(updates).length > 0) {
    // }
  };

  useEffect(() => {
    handleValueUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoadForm.values, variablesList]);

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
                category="data"
                key={key}
                componentId={component?.id!}
                onPickVariable={(variable: string) =>
                  onLoadForm.setFieldValue(`${key}Key`, variable)
                }
                actionData={[]}
                javascriptCode={form.values.actionCode}
                onChangeJavascriptCode={(
                  javascriptCode: string,
                  label: string,
                ) =>
                  setFieldValue(`actionCode`, {
                    ...form.values.actionCode,
                    [label]: javascriptCode,
                  })
                }
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
            <VisibilityModifier
              componentId={component.id!}
              componentName={component.name}
              form={form}
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
