import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { FieldProps } from "@/types/dataBinding";

type StaticFormFieldsBuilderProps = {
  field: FieldProps;
  form: any;
};

export const StaticFormFieldsBuilder = ({
  field,
  form,
}: StaticFormFieldsBuilderProps) => {
  if (field.type === "select") {
    return (
      <ComponentToBindFromSelect
        size="xs"
        key={field.name}
        data={field.data}
        label={field.label}
        placeholder={field.placeholder}
        {...form.getInputProps(`onLoad.${field.name}`)}
        isTranslatable
      />
    );
  }

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
      isTranslatable
    />
  );
};
