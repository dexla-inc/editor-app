import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export const TextData = ({ component }: DataProps) => {
  const { getSelectedVariable } = useBindingPopover();
  const isNavLink = component.name === "NavLink";
  const isFileButton = component.name === "FileButton";

  const itemKey = isNavLink ? "label" : isFileButton ? "name" : "children";

  const form = useForm({
    initialValues: {
      [itemKey]: component.props?.[itemKey] ?? "",
      actionCode: component.props?.actionCode ?? {},
      variable: component.props?.variable ?? "",
    },
  });

  const updateItemKey = (value: string) => {
    const variable = getSelectedVariable(value);
    form.setFieldValue(itemKey, variable?.defaultValue);
  };

  useEffect(() => {
    debouncedTreeUpdate(component.id, form.values);
  }, [form.values]);

  return (
    <form>
      <Stack spacing="xs">
        <ComponentToBindFromInput
          componentId={component?.id!}
          onPickVariable={(variable: string) => {
            form.setFieldValue("variable", variable);
            updateItemKey(variable);
          }}
          category="data"
          javascriptCode={form.values.actionCode}
          onChangeJavascriptCode={(javascriptCode: string, label: string) => {
            form.setFieldValue(`actionCode`, {
              ...form.values.actionCode,
              [label]: javascriptCode,
            });
          }}
          size="xs"
          label="Value"
          {...form.getInputProps(itemKey)}
          onChange={(e) => form.setFieldValue(itemKey, e.currentTarget.value)}
        />

        <VisibilityModifier
          component={component}
          form={form}
          debouncedTreeUpdate={debouncedTreeUpdate}
        />
      </Stack>
    </form>
  );
};
