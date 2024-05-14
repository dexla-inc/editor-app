import { withModifier } from "@/hoc/withModifier";
import { CheckboxFormBuilder } from "@/components/modifiers/CheckboxFormBuilder";
import { Stack } from "@mantine/core";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

const Modifier = withModifier(({ selectedComponent }) => {
  return (
    <CheckboxFormBuilder selectedComponent={selectedComponent}>
      {({ form, onChange }) => {
        return (
          <Stack spacing={2}>
            <SegmentedControlYesNo
              label="Work Like Radio"
              value={form.getInputProps("workLikeRadio").value}
              onChange={(value) => onChange("workLikeRadio", value)}
            />
          </Stack>
        );
      }}
    </CheckboxFormBuilder>
  );
});

export default Modifier;
