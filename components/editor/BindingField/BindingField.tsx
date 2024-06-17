import {
  ComponentToBindFromInput,
  ComponentToBindFromInputProps,
} from "@/components/editor/BindingField/components/ComponentToBindFromInput";
import React from "react";
import { FieldType } from "@/types/dataBinding";

export const BindingField = <T extends FieldType>(
  props: ComponentToBindFromInputProps<T>,
) => {
  const InnerField = ComponentToBindFromInput[props.fieldType];

  return (
    <ComponentToBindFromInput size="xs" {...props}>
      <InnerField />
    </ComponentToBindFromInput>
  );
};
