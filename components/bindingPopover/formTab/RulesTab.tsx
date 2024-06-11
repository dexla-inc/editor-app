import { BindingContextSelector } from "@/components/bindingPopover/fields/BindingContextSelector";
import { SelectLogicalRules } from "@/components/SelectLogicalRules";
import { Stack, TextInput } from "@mantine/core";
import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ValueProps } from "@/types/dataBinding";

type RulesTabProps = {
  fieldType: FieldType;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
};

export const RulesTab = ({ fieldType, value, onChange }: RulesTabProps) => {
  // @ts-ignore
  const InnerField = ComponentToBindFromInput[fieldType];
  return (
    <Stack>
      <BindingContextSelector />
      <SelectLogicalRules />
      <ComponentToBindFromInput
        value={value}
        onChange={onChange}
        isBindable={false}
      >
        <InnerField />
      </ComponentToBindFromInput>
      <TextInput label="Result" />
    </Stack>
  );
};
