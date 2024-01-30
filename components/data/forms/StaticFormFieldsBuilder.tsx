import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Component } from "@/utils/editor";
import { useBindingPopover } from "@/hooks/useBindingPopover";

type StaticFormFieldsBuilderProps = {
  field: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    additionalComponent?: JSX.Element;
  };
  component: Component;
  form: any;
};

export const StaticFormFieldsBuilder = ({
  component,
  field,
  form,
}: StaticFormFieldsBuilderProps) => {
  const { getSelectedVariableName } = useBindingPopover();

  return (
    <ComponentToBindFromInput
      category="data"
      key={field.name}
      componentId={component?.id!}
      onPickVariable={(variable: string) =>
        form.setFieldValue(`onLoad.${field.name}.value`, `${variable}`)
      }
      actionData={[]}
      javascriptCode={form.values.props.actionCode}
      onChangeJavascriptCode={(javascriptCode: string, label: string) =>
        form.setFieldValue(`props.actionCode`, {
          ...form.values.props.actionCode,
          [label]: javascriptCode,
        })
      }
      size="xs"
      label={field.label}
      type={field.type}
      placeholder={field.placeholder}
      {...form.getInputProps(`onLoad.${field.name}.value`)}
      value={getSelectedVariableName(form.values.onLoad[field.name].value)}
    />
  );
};
