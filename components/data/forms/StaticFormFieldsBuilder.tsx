import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ComponentToBindFromSegmentedControl } from "@/components/ComponentToBindFromSegmentedControl";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { FieldProps } from "@/types/dataBinding";

type StaticFormFieldsBuilderProps = {
  field: FieldProps;
  form: any;
  isTranslatable?: boolean;
};

export const StaticFormFieldsBuilder = ({
  field,
  form,
  isTranslatable,
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
        isTranslatable={isTranslatable}
      />
    );
  }

  if (field.type === "segment") {
    return (
      <ComponentToBindFromSegmentedControl
        size="xs"
        key={field.name}
        data={field.data}
        label={field.label}
        placeholder={field.placeholder}
        {...form.getInputProps(`onLoad.${field.name}`)}
        isTranslatable={isTranslatable}
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
