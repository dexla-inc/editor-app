import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { SegmentedControl, Stack } from "@mantine/core";
import { ModalDrawerFormBuilder } from "@/components/modifiers/ModalDrawerFormBuilder";
import { SizeSelector } from "../SizeSelector";

const Modifier = withModifier(({ selectedComponent }) => {
  return (
    <ModalDrawerFormBuilder selectedComponent={selectedComponent}>
      {({ form, onChange }) => {
        return (
          <Stack spacing={2}>
            <TopLabel text="Position" />
            <SegmentedControl
              size="xs"
              data={[
                { label: "Left", value: "left" },
                { label: "Top", value: "top" },
                { label: "Right", value: "right" },
                { label: "Bottom", value: "bottom" },
              ]}
              {...form.getInputProps("position")}
              onChange={(value) => onChange("position", value)}
            />
            <SizeSelector
              label="Size"
              showFullLabel
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
