import BindingPopover from "@/components/BindingPopover";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { Component } from "@/utils/editor";
import { Group, Stack } from "@mantine/core";

type Props = {
  form: any;
  component: Component;
  debouncedTreeUpdate: any;
  onChange?: any;
};

export const VisibilityModifier = ({
  component,
  form,
  debouncedTreeUpdate,
  onChange,
}: Props) => {
  const setFieldValue = (value: string) => {
    form.setFieldValue("display", value);
    debouncedTreeUpdate(component.id, { style: { display: value } });
  };

  return (
    <Group spacing="xs" noWrap align="end">
      <Stack w="100%">
        <SegmentedControlInput
          label="Visibility"
          data={[
            {
              label: "Visible",
              value: getComponentInitialDisplayValue(component.name),
            },
            {
              label: "Hidden",
              value: "none",
            },
          ]}
          {...form.getInputProps("display")}
          onChange={(value) => {
            onChange && onChange(value);
            if (!onChange) {
              setFieldValue(value);
            }
          }}
        />
      </Stack>
      <BindingPopover
        bindingType="JavaScript"
        category="appearance"
        onChangeBindingType={() => {}}
        onPickVariable={(value: string) => setFieldValue(value)}
        javascriptCode={form.values.actionCode?.[component.id!] as string}
        onChangeJavascriptCode={(javascriptCode: string, _: any) => {
          form.setFieldValue(`actionCode.${component.id}`, javascriptCode);
          debouncedTreeUpdate(component.id, {
            actionCode: {
              ...form.values.actionCode,
              [component.id!]: javascriptCode,
            },
          });
        }}
      />
    </Group>
  );
};
