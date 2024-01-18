import BindingPopover, { useBindingPopover } from "@/components/BindingPopover";
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

export const Appearance = ({
  component,
  form,
  debouncedTreeUpdate,
  onChange,
}: Props) => {
  const { opened, toggle, open, close } = useBindingPopover();

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
              form.setFieldValue("display", value as string);
              debouncedTreeUpdate(component.id, {
                style: {
                  display: value,
                },
              });
            }
          }}
        />
      </Stack>
      <BindingPopover
        opened={opened}
        onOpenPopover={open}
        onTogglePopover={toggle}
        onClosePopover={close}
        bindingType="JavaScript"
        onChangeBindingType={() => {}}
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
