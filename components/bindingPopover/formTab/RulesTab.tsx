import { BindingContextSelector } from "@/components/bindingPopover/fields/BindingContextSelector";
import { SelectLogicalRules } from "@/components/SelectLogicalRules";
import { Stack, TextInput } from "@mantine/core";

export const RulesTab = () => {
  return (
    <Stack>
      <BindingContextSelector />
      <SelectLogicalRules />
      <TextInput label="Result" />
    </Stack>
  );
};
