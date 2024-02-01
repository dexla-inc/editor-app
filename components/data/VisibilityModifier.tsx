import BindingPopover from "@/components/BindingPopover";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { Group, Stack } from "@mantine/core";

type Props = {
  form: any;
  componentId: string;
  componentName: string;
};

export const VisibilityModifier = ({
  componentId,
  componentName,
  form,
}: Props) => {
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
      <BindingPopover
        bindingType="JavaScript"
        category="appearance"
        onChangeBindingType={() => {}}
        javascriptCode={form.values.actionCode?.[componentId] as string}
        onChangeJavascriptCode={(javascriptCode: string) => {
          form.setFieldValue(`props.actionCode.${componentId}`, javascriptCode);
        }}
      />
    </Group>
  );
};
