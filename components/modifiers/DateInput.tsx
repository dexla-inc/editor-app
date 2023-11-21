import { Icon } from "@/components/Icon";
import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { ICON_DELETE } from "@/utils/config";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
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
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { StylingPaneItemIcon } from "./StylingPaneItemIcon";

export const icon = IconForms;
export const label = "Date Input";

const defaultValues = requiredModifiers.dateInput;

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "label",
        "placeholder",
        "description",
        "radius",
        "size",
        "isDisabled",
        "withAsterisk",
        "clearable",
        "valueFormat",
        "icon",
        "labelProps",
        "styles",
      ]);

      form.setValues({
        label: data.label ?? defaultValues.label,
        labelSize: data?.labelProps?.size ?? defaultValues.labelSize,
        labelSpacing: data.labelProps?.mb ?? defaultValues.labelSpacing,
        labelWeight: data.styles?.label.fontWeight ?? defaultValues.labelWeight,
        labelAlign: data.styles?.label.textAlign ?? defaultValues.labelAlign,
        placeholder: defaultValues.placeholder,
        description: data.description ?? defaultValues.description,
        radius: data.radius ?? defaultValues.radius,
        size: data.size ?? defaultValues.size,
        disabled: data.isDisabled ?? defaultValues.disabled,
        withAsterisk: data.withAsterisk ?? defaultValues.withAsterisk,
        clearable: data.clearable ?? defaultValues.clearable,
        valueFormat: data.valueFormat ?? defaultValues.valueFormat,
        icon: data.icon ?? defaultValues.icon,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

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
              debouncedTreeComponentPropsUpdate("label", _value);
            }}
          />
          <SizeSelector
            label="Label Size"
            {...form.getInputProps("labelSize")}
            onChange={(value) => {
              form.setFieldValue("labelSize", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
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
              debouncedTreeComponentPropsUpdate("labelProps", {
                mb: value as string,
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
              debouncedTreeUpdate(selectedComponent?.id as string, {
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
              debouncedTreeUpdate(selectedComponent?.id as string, {
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
            debouncedTreeComponentPropsUpdate("description", e.target.value);
          }}
        />
        <TextInput
          size="xs"
          label="Format"
          {...form.getInputProps("valueFormat")}
          onChange={(e) => {
            form.setFieldValue("valueFormat", e.target.value);
            debouncedTreeComponentPropsUpdate("valueFormat", e.target.value);
          }}
        />
        <TextInput
          size="xs"
          label="Placeholder"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            form.setFieldValue("placeholder", e.target.value);
            debouncedTreeComponentPropsUpdate("placeholder", e.target.value);
          }}
        />
        <Flex justify="space-between">
          <SwitchSelector
            topLabel="Required"
            checked={form.getInputProps("withAsterisk").value}
            onChange={(e) => {
              form.setFieldValue("withAsterisk", e.currentTarget.checked);
              debouncedTreeComponentPropsUpdate(
                "withAsterisk",
                e.currentTarget.checked,
              );
            }}
          />
          <SwitchSelector
            topLabel="Clearable"
            checked={form.getInputProps("clearable").value}
            onChange={(e) => {
              form.setFieldValue("clearable", e.currentTarget.checked);
              debouncedTreeComponentPropsUpdate(
                "clearable",
                e.currentTarget.checked,
              );
            }}
          />
          <SwitchSelector
            topLabel="Disabled"
            checked={form.getInputProps("disabled").value}
            onChange={(e) => {
              form.setFieldValue("disabled", e.currentTarget.checked);
              debouncedTreeComponentPropsUpdate(
                "isDisabled",
                e.currentTarget.checked,
              );
            }}
          />
        </Flex>
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(e) => {
            form.setFieldValue("size", e);
            debouncedTreeComponentPropsUpdate("size", e);
          }}
        />
        <SizeSelector
          label="Radius"
          {...form.getInputProps("radius")}
          onChange={(e) => {
            form.setFieldValue("radius", e);
            debouncedTreeComponentPropsUpdate("radius", e);
          }}
        />
        <Group noWrap spacing="xs">
          <IconSelector
            topLabel="Icon"
            selectedIcon={form.values.icon}
            onIconSelect={(value: string) => {
              form.setFieldValue("icon", value);
              debouncedTreeComponentPropsUpdate("icon", value);
            }}
          />
          <ActionIcon
            onClick={() => {
              debouncedTreeComponentPropsUpdate("icon", null);
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
});
