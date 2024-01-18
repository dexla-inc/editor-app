import BindingPopover from "@/components/BindingPopover";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { Component } from "@/utils/editor";
import { Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  form: any;
  selectedComponent: Component;
  debouncedTreeUpdate: any;
  onChange?: any;
};

export const Appearance = ({
  selectedComponent,
  form,
  debouncedTreeUpdate,
  onChange,
}: Props) => {
  const [
    opened,
    { toggle: onToggleBinder, open: onOpenBinder, close: onCloseBinder },
  ] = useDisclosure(false);
  return (
    <Group spacing="xs" noWrap align="end">
      <Stack w="100%">
        <SegmentedControlInput
          label="Visibility"
          data={[
            {
              label: "Visible",
              value: getComponentInitialDisplayValue(selectedComponent.name),
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
              debouncedTreeUpdate(selectedComponent.id, {
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
        onTogglePopover={onToggleBinder}
        onClosePopover={onCloseBinder}
        bindingType="JavaScript"
        onChangeBindingType={() => {}}
        javascriptCode={
          form.values.actionCode?.[selectedComponent.id!] as string
        }
        onChangeJavascriptCode={(javascriptCode: string, _: any) => {
          form.setFieldValue(
            `actionCode.${selectedComponent.id}`,
            javascriptCode,
          );
          debouncedTreeUpdate(selectedComponent.id, {
            actionCode: {
              ...form.values.actionCode,
              [selectedComponent.id!]: javascriptCode,
            },
          });
        }}
        onOpenPopover={onOpenBinder}
        onPickComponent={{}}
        onPickVariable={(variable: string) => {}}
        style="iconButton"
      />
    </Group>
  );
};
