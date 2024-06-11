import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { FrontEndTypes } from "@/requests/variables/types";

export type FieldType =
  | "Password"
  | "Email"
  | "Tel"
  | "Url"
  | "Date"
  | "Unit"
  | "YesNo"
  | "Integer"
  | "Options"
  | Capitalize<Lowercase<FrontEndTypes>>;

type StaticFormFieldsBuilderProps = {
  field: {
    name: string;
    label: string;
    type: FieldType;
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
  // @ts-ignore
  const InnerField = ComponentToBindFromInput[field.type];

  return (
    <ComponentToBindFromInput
      size="xs"
      key={field.name}
      label={field.label}
      placeholder={field.placeholder}
      fieldType={field.type}
      decimalPlaces={field.decimalPlaces}
      {...form.getInputProps(`onLoad.${field.name}`)}
      form={form}
    >
      <InnerField />
    </ComponentToBindFromInput>
  );
};
