import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { Flex, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconForms } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconForms;
export const label = "Input";

export const defaultInputValues = {
  size: "sm",
  placeholder: "Input",
  type: "text",
  label: "",
  icon: { props: { name: "" } },
  withAsterisk: false,
  labelSpacing: "0",
  labelWeight: "normal",
  name: "Input",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "style",
        "label",
        "size",
        "placeholder",
        "type",
        "icon",
        "withAsterisk",
        "labelProps",
        "name",
        "labelWeight",
      ]);

      form.setValues({
        size: data.size ?? defaultInputValues.size,
        placeholder: data.placeholder ?? defaultInputValues.placeholder,
        type: data.type ?? defaultInputValues.type,
        label: data.label ?? defaultInputValues.label,
        icon: data.icon ?? defaultInputValues.icon,
        name: data.name ?? defaultInputValues.name,
        withAsterisk: data.withAsterisk ?? defaultInputValues.withAsterisk,
        labelSpacing: data.labelProps?.mb ?? defaultInputValues.labelSpacing,
        ...data.style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedTreeComponentPropsUpdate("label", e.target.value);
          }}
        />
        <TextInput
          label="Placeholder"
          size="xs"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            form.setFieldValue("placeholder", e.target.value);
            debouncedTreeComponentPropsUpdate("placeholder", e.target.value);
          }}
        />
        <Select
          label="Type"
          size="xs"
          data={INPUT_TYPES_DATA}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as string);
            debouncedTreeComponentPropsUpdate("type", value as string);
          }}
        />
        <TextInput
          label="Name"
          size="xs"
          {...form.getInputProps("name")}
          onChange={(e) => {
            form.setFieldValue("name", e.target.value);
            debouncedTreeComponentPropsUpdate("name", e.target.value);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value as string);
          }}
        />
        <SwitchSelector
          topLabel="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(event) => {
            form.setFieldValue("withAsterisk", event.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "withAsterisk",
              event.currentTarget.checked,
            );
          }}
        />
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
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.icon?.props?.name}
          onIconSelect={(iconName: string) => {
            const icon = { props: { name: iconName } };
            form.setFieldValue("icon.props.name", iconName);
            debouncedTreeComponentPropsUpdate("icon", icon);
          }}
        />
      </Stack>
    </form>
  );
});
