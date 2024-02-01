import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { Group, Stack } from "@mantine/core";

type Props = {
  form: any;
  componentId: string;
  componentName: string;
};

export const VisibilityModifier = ({ componentName, form }: Props) => {
  return (
    <Group spacing="xs" noWrap align="end">
      <Stack w="100%">
        <SegmentedControlInput
          label="Visibility"
          data={[
            {
              label: "Visible",
              value: getComponentInitialDisplayValue(componentName),
            },
            {
              label: "Hidden",
              value: "none",
            },
          ]}
          {...form.getInputProps("props.style.display")}
        />
      </Stack>
      {/* TODO: come with a solution to make bindable style properties */}
      {/*<BindingPopover*/}
      {/*  value={}*/}
      {/*  onChange={}*/}
      {/*  prop="props.style.display"*/}
      {/*/>*/}
    </Group>
  );
};
