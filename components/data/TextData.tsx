import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export const TextData = ({ component, endpoints }: DataProps) => {
  const isNavLink = component.name === "NavLink";
  const isFileButton = component.name === "FileButton";
  const { getSelectedVariable } = useBindingPopover();

  const itemKey = isNavLink ? "label" : isFileButton ? "name" : "children";

  const form = useForm({
    initialValues: {
      [itemKey]: component.props?.[itemKey] ?? "",
      hideIfDataIsEmpty: component.props?.hideIfDataIsEmpty ?? false,
      endpoint: component.props?.endpoint ?? undefined,
      actionCode: component.props?.actionCode ?? {},
      dataType: component.props?.dataType ?? "static",
      variable: component.props?.variable ?? "",
      initiallyOpened: true,
    },
  });

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  const selectedVariable = getSelectedVariable(form.values.variable);

  const handleValueUpdate = () => {
    if (selectedVariable) {
      setFieldValue(itemKey, selectedVariable.defaultValue);
    }
  };

  useEffect(() => {
    handleValueUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.variable, selectedVariable]);

  return (
    <form>
      <Stack spacing="xs">
        <ComponentToBindFromInput
          componentId={component?.id!}
          onPickVariable={(variable: string) =>
            form.setFieldValue("variable", variable)
          }
          category="data"
          actionData={[]}
          javascriptCode={form.values.actionCode}
          onChangeJavascriptCode={(javascriptCode: string, label: string) =>
            setFieldValue(`actionCode`, {
              ...form.values.actionCode,
              [label]: javascriptCode,
            })
          }
          size="xs"
          label="Value"
          {...form.getInputProps(itemKey)}
          onChange={(e) => setFieldValue(itemKey, e.currentTarget.value)}
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
