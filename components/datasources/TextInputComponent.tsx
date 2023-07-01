import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { ReactNode } from "react";

interface TextInputComponentProps<TForm> {
  label: ReactNode;
  description: ReactNode;
  placeholder: string;
  form: UseFormReturnType<TForm>;
  propertyName: string;
  value?: any;
  setProperty?: (value: string | null) => void;
  required?: boolean;
}

export default function TextInputComponent<TForm>({
  label,
  description,
  placeholder,
  value,
  form,
  propertyName,
  setProperty,
  required,
}: TextInputComponentProps<TForm>) {
  const { value: formValue, ...inputProps } = form.getInputProps(propertyName);

  return (
    <TextInput
      label={label}
      description={description}
      placeholder={placeholder}
      required={required}
      {...(setProperty
        ? {
            onChange: (event) => {
              setProperty(event.currentTarget.value);
              inputProps.onChange(event.currentTarget.value);
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
