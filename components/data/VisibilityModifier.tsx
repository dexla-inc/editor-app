import BindingPopover from "@/components/BindingPopover";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { Group, Stack } from "@mantine/core";
import { debouncedTreeUpdate } from "@/utils/editor";

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
          {...form.getInputProps("style.display")}
        />
      </Stack>
      <BindingPopover
        bindingType="JavaScript"
        category="appearance"
        onChangeBindingType={() => {}}
        onPickVariable={(value: string) =>
          form.setFieldValue("style.display", value)
        }
        javascriptCode={form.values.actionCode?.[componentId] as string}
        onChangeJavascriptCode={(javascriptCode: string, _: any) => {
          form.setFieldValue(`actionCode.${componentId}`, javascriptCode);
          debouncedTreeUpdate(componentId, {
            actionCode: {
              ...form.values.actionCode,
              [componentId!]: javascriptCode,
            },
          });
        }}
      />
    </Group>
  );
};
