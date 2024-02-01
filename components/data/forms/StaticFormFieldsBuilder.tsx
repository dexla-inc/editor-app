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
      size="xs"
      key={field.name}
      label={field.label}
      componentId={component?.id!}
      placeholder={field.placeholder}
      {...form.getInputProps(`onLoad.${field.name}`)}
    />
  );
};
