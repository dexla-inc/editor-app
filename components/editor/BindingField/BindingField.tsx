import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import React from "react";

export type FieldType =
  | "Text"
  | "YesNo"
  | "Boolean"
  | "Array"
  | "Number"
  | "Options"
  | "Select"
  | "Segmented";

type StaticFormFieldsBuilderProps = {
  field: {
    name: string;
    label: string;
    fieldType: FieldType;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    additionalComponent?: JSX.Element;
    precision?: number;
  };
  form: any;
};

export const BindingField = ({ field, form }: StaticFormFieldsBuilderProps) => {
  // @ts-ignore
  const InnerField = ComponentToBindFromInput[field.type];

  return (
    <ComponentToBindFromInput
      size="xs"
      key={field.name}
      label={field.label}
      placeholder={field.placeholder}
      fieldType={field.type}
      precision={field.precision}
      {...form.getInputProps(`onLoad.${field.name}`)}
      form={form}
    >
      <InnerField />
    </ComponentToBindFromInput>
  );
};
