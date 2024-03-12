import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";

export type FieldType =
  | "text"
  | "number"
  | "yesno"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "date"
  | "unit";

type StaticFormFieldsBuilderProps = {
  field: {
    name: string;
    label: string;
    type?: FieldType;
    placeholder?: string;
    additionalComponent?: JSX.Element;
    defaultValue?: any;
    decimalPlaces?: number;
  };
  form: any;
};

export const StaticFormFieldsBuilder = ({
  field,
  form,
}: StaticFormFieldsBuilderProps) => {
  return (
    <ComponentToBindFromInput
      size="xs"
      key={field.name}
      label={field.label}
      placeholder={field.placeholder}
      fieldType={field.type}
      defaultValue={field.defaultValue}
      decimalPlaces={field.decimalPlaces}
      {...form.getInputProps(`onLoad.${field.name}`)}
    />
  );
};
