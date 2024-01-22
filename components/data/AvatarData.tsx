import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export const AvatarData = ({ component }: DataProps) => {
  const isImageComponent = component.name === "Image";
  const propsArray = isImageComponent ? ["src", "alt"] : ["children", "src"];
  const { getSelectedVariable } = useBindingPopover();

  const form = useForm({
    initialValues: {
      ...(!isImageComponent && {
        children: component.props?.children ?? "",
        childrenKey: component.props?.childrenKey ?? "",
      }),
      ...(isImageComponent && {
        alt: component.props?.alt ?? "",
        altKey: component.props?.altKey ?? "",
      }),
      src: component.props?.src ?? "",
      srcKey: component.props?.srcKey ?? "",
      actionCode: component.props?.actionCode ?? {},
    },
  });

  const updateItemKey = (key: string, value: string) => {
    const variable = getSelectedVariable(value);
    form.setFieldValue(key, variable?.defaultValue);
  };

  useEffect(() => {
    debouncedTreeUpdate(component.id, form.values);
  }, [form.values]);

  return (
    <form>
      <Stack spacing="xs">
        {propsArray.map((key) => (
          <ComponentToBindFromInput
            category="data"
            key={key}
            componentId={component?.id!}
            onPickVariable={(variable: string) => {
              form.setFieldValue(`${key}Key`, variable);
              updateItemKey(key, variable);
            }}
            javascriptCode={form.values.actionCode}
            onChangeJavascriptCode={(javascriptCode: string, label: string) =>
              form.setFieldValue(`actionCode`, {
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
            onChange={(e) => form.setFieldValue(key, e.currentTarget.value)}
          />
        ))}
        <VisibilityModifier
          component={component}
          form={form}
          debouncedTreeUpdate={debouncedTreeUpdate}
        />
      </Stack>
    </form>
  );
};
