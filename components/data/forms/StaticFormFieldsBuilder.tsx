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
  return (
    <ComponentToBindFromInput
      key={field.name}
      componentId={component?.id!}
      size="xs"
      label={field.label}
      placeholder={field.placeholder}
      {...form.getInputProps(`onLoad.${field.name}`)}
    />
  );
};
