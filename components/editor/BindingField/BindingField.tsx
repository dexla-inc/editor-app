import {
  ComponentToBindFromInput,
  ComponentToBindFromInputProps,
} from "@/components/ComponentToBindFromInput";
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

export const BindingField = <T extends FieldType>(
  props: ComponentToBindFromInputProps<T>,
) => {
  // @ts-ignore
  const InnerField = ComponentToBindFromInput[props.fieldType];

  return (
    <ComponentToBindFromInput size="xs" {...props}>
      <InnerField />
    </ComponentToBindFromInput>
  );
};
