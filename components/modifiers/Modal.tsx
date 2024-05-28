import { withModifier } from "@/hoc/withModifier";
import { ModalDrawerFormBuilder } from "@/components/modifiers/ModalDrawerFormBuilder";
import { Stack } from "@mantine/core";
import { modalSizes } from "@/utils/defaultSizes";
import { SegmentedControlSizes } from "../SegmentedControlSizes";

const Modifier = withModifier(({ selectedComponent }) => {
  return (
    <ModalDrawerFormBuilder selectedComponent={selectedComponent}>
      {({ form, onChange }) => {
        return (
          <Stack spacing={2}>
            <SegmentedControlSizes
              label="Size"
              sizing={modalSizes}
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
