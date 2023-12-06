import { Icon } from "@/components/Icon";
import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { StylingPaneItemIcon } from "@/components/StylingPaneItemIcon";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { ICON_DELETE } from "@/utils/config";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import {
  ActionIcon,
  Flex,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconForms,
} from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconForms;
export const label = "Date Input";

const defaultValues = requiredModifiers.dateInput;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultValues, {
        label: selectedComponent?.props?.label,
        labelSize: selectedComponent?.props?.labelProps?.size,
        labelSpacing: selectedComponent?.props?.labelProps?.mb,
        labelWeight: selectedComponent?.props?.styles?.label?.fontWeight,
        labelAlign: selectedComponent?.props?.styles?.label?.textAlign,
        placeholder: selectedComponent?.props?.placeholder,
        description: selectedComponent?.props?.description,
        radius: selectedComponent?.props?.radius,
        size: selectedComponent?.props?.size,
        disabled: selectedComponent?.props?.isDisabled,
        withAsterisk: selectedComponent?.props?.withAsterisk,
        clearable: selectedComponent?.props?.clearable,
        valueFormat: selectedComponent?.props?.valueFormat,
        icon: selectedComponent?.props?.icon,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <Group noWrap>
            <TextInput
              size="xs"
              label="Label"
              {...form.getInputProps("label")}
              onChange={(e) => {
                form.setFieldValue("label", e.target.value);
                const _value = !!e.target.value ? e.target.value : null;
                debouncedTreeUpdate(selectedComponentIds, { label: _value });
              }}
            />
            <SizeSelector
              label="Label Size"
              {...form.getInputProps("labelSize")}
              onChange={(value) => {
                form.setFieldValue("labelSize", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  labelProps: { size: value },
                });
              }}
            />
          </Group>
          <Flex gap={3}>
            <SizeSelector
              label="Label Spacing"
              {...form.getInputProps("labelSpacing")}
              onChange={(value) => {
                form.setFieldValue("labelSpacing", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  labelProps: { mb: value },
                });
              }}
            />
            <Select
              label="Label Weight"
              size="xs"
              data={[
                { label: "Normal", value: "normal" },
                { label: "Bold", value: "bold" },
              ]}
              {...form.getInputProps("labelWeight")}
              onChange={(value) => {
                form.setFieldValue("labelWeight", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  styles: { label: { fontWeight: value } },
                });
              }}
            />
          </Flex>
          <Stack spacing={2}>
            <Text size="xs" fw={500}>
              Alignment
            </Text>
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Left"
                      icon={<IconAlignLeft size={14} />}
                    />
                  ),
                  value: "left",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Center"
                      icon={<IconAlignCenter size={14} />}
                    />
                  ),
                  value: "center",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Right"
                      icon={<IconAlignRight size={14} />}
                    />
                  ),
                  value: "right",
                },
              ]}
              styles={{
                label: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                },
              }}
              {...form.getInputProps("labelAlign")}
              onChange={(value) => {
                form.setFieldValue("labelAlign", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  styles: {
                    label: { textAlign: value as string },
                  },
                });
              }}
            />
          </Stack>
          <Textarea
            autosize
            label="Description"
            size="xs"
            {...form.getInputProps("description")}
            onChange={(e) => {
              form.setFieldValue("description", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                description: e.target.value,
              });
            }}
          />
          <TextInput
            size="xs"
            label="Format"
            {...form.getInputProps("valueFormat")}
            onChange={(e) => {
              form.setFieldValue("valueFormat", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                valueFormat: e.target.value,
              });
            }}
          />
          <TextInput
            size="xs"
            label="Placeholder"
            {...form.getInputProps("placeholder")}
            onChange={(e) => {
              form.setFieldValue("placeholder", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                placeholder: e.target.value,
              });
            }}
          />
          <Flex justify="space-between">
            <SwitchSelector
              topLabel="Required"
              checked={form.getInputProps("withAsterisk").value}
              onChange={(e) => {
                form.setFieldValue("withAsterisk", e.currentTarget.checked);
                debouncedTreeUpdate(selectedComponentIds, {
                  withAsterisk: e.currentTarget.checked,
                });
              }}
            />
            <SwitchSelector
              topLabel="Clearable"
              checked={form.getInputProps("clearable").value}
              onChange={(e) => {
                form.setFieldValue("clearable", e.currentTarget.checked);
                debouncedTreeUpdate(selectedComponentIds, {
                  clearable: e.currentTarget.checked,
                });
              }}
            />
            <SwitchSelector
              topLabel="Disabled"
              checked={form.getInputProps("disabled").value}
              onChange={(e) => {
                form.setFieldValue("disabled", e.currentTarget.checked);
                debouncedTreeUpdate(selectedComponentIds, {
                  isDisabled: e.currentTarget.checked,
                });
              }}
            />
          </Flex>
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(e) => {
              form.setFieldValue("size", e);
              debouncedTreeUpdate(selectedComponentIds, {
                size: e,
              });
            }}
          />
          <SizeSelector
            label="Radius"
            {...form.getInputProps("radius")}
            onChange={(e) => {
              form.setFieldValue("radius", e);
              debouncedTreeUpdate(selectedComponentIds, {
                radius: e,
              });
            }}
          />
          <Group noWrap spacing="xs">
            <IconSelector
              topLabel="Icon"
              selectedIcon={form.values.icon}
              onIconSelect={(value: string) => {
                form.setFieldValue("icon", value);
                debouncedTreeUpdate(selectedComponentIds, {
                  icon: value,
                });
              }}
            />
            <ActionIcon
              onClick={() => {
                debouncedTreeUpdate(selectedComponentIds, {
                  icon: null,
                });
              }}
              variant="light"
              radius="xl"
            >
              <Icon name={ICON_DELETE} />
            </ActionIcon>
          </Group>
        </Stack>
      </form>
    );
  },
);
