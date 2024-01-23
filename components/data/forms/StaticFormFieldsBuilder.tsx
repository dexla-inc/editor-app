import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Component, debouncedTreeUpdate } from "@/utils/editor";
import { useForm } from "@mantine/form";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useEffect } from "react";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { pick } from "next/dist/lib/pick";

type StaticFormFieldsBuilderProps = {
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
  }>;
  component: Component;
};

export const StaticFormFieldsBuilder = ({
  component,
  fields,
}: StaticFormFieldsBuilderProps) => {
  const form = useForm({
    initialValues: {
      ...pick(
        component.props ?? {},
        fields.map((f) => f.name),
      ),
      actionCode: component.props?.actionCode ?? {},
      variable: component.props?.variable ?? "",
    },
  });
  const { getSelectedVariable } = useBindingPopover();

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeUpdate([component.id!], form.values);
    }
  }, [form.values]);

  return (
    <>
      {fields.map((f) => (
        <ComponentToBindFromInput
          category="data"
          key={f.name}
          componentId={component?.id!}
          onPickVariable={(variable: string) =>
            form.setFieldValue("variable", variable)
          }
          actionData={[]}
          javascriptCode={form.values.actionCode}
          onChangeJavascriptCode={(javascriptCode: string, label: string) =>
            form.setFieldValue(`actionCode`, {
              ...form.values.actionCode,
              [label]: javascriptCode,
            })
          }
          size="xs"
          label={f.label}
          type={f.type}
          placeholder={f.placeholder}
          {...form.getInputProps(f.name)}
          onChange={(e) => {
            const selectedVariable = getSelectedVariable(e.currentTarget.value);
            form.setValues({
              [f.name]: selectedVariable
                ? selectedVariable.defaultValue
                : e.currentTarget.value,
            });
          }}
        />
      ))}
      <VisibilityModifier
        componentId={component.id!}
        componentName={component.name}
        form={form}
      />
    </>
  );
};
