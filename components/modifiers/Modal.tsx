import { withModifier } from "@/hoc/withModifier";
import { ModalDrawerFormBuilder } from "@/components/modifiers/ModalDrawerFormBuilder";
import { SizeSelector } from "../SizeSelector";
import { Stack } from "@mantine/core";

const Modifier = withModifier(({ selectedComponent }) => {
  return (
    <ModalDrawerFormBuilder selectedComponent={selectedComponent}>
      {({ form, onChange }) => {
        return (
          <Stack spacing={2}>
            <SizeSelector
              label="Size"
              showFullLabel
              showFullscreen
              showNone={false}
              {...form.getInputProps("size")}
              onChange={(value) => onChange("size", value as string)}
            />
          </Stack>
        );
      }}
    </ModalDrawerFormBuilder>
  );
});

export default Modifier;
