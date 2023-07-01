import { Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { ReactNode } from "react";

interface SearchableSelectComponentProps<TForm> {
  label: ReactNode;
  description: ReactNode;
  placeholder: string;
  form: UseFormReturnType<TForm>;
  propertyName: string;
  data: ReadonlyArray<string | any>;
  value?: any;
  setProperty?: (value: string | null) => void;
  nothingFoundText?: string;
}

export default function SearchableSelectComponent<TForm>({
  label,
  description,
  placeholder,
  value,
  form,
  propertyName,
  data,
  setProperty,
  nothingFoundText,
}: SearchableSelectComponentProps<TForm>) {
  const { value: formValue, ...inputProps } = form.getInputProps(propertyName);

  return (
    <Select
      label={label}
      description={description}
      placeholder={placeholder}
      searchable
      nothingFound={nothingFoundText ?? "No options"}
      data={data}
      {...(setProperty
        ? {
            onChange: (value) => {
              setProperty(value);
              inputProps.onChange(value);
            },
            value: value ?? formValue,
          }
        : {
            ...inputProps,
            defaultValue: value ?? formValue,
          })}
    />
  );
}
