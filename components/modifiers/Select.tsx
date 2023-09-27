import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { SizeSelector } from "@/components/SizeSelector";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSelect } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconSelect;
export const label = "Select";

export const defaultSelectValues = {
  name: "Select",
  size: "sm",
  placeholder: "Select",
  type: "text",
  label: "A label",
  icon: "",
  withAsterisk: false,
  labelSize: "sm",
  labelWeight: "normal",
  labelAlign: "left",
  data: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
  ],
  exampleData: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
  ],
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultSelectValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "name",
        "style",
        "styles",
        "label",
        "size",
        "placeholder",
        "type",
        "icon",
        "data",
        "withAsterisk",
        "labelProps",
      ]);

      form.setValues({
        name: data.name ?? defaultSelectValues.name,
        size: data.size ?? defaultSelectValues.size,
        placeholder: data.placeholder ?? defaultSelectValues.placeholder,
        type: data.type ?? defaultSelectValues.type,
        label: data.label ?? defaultSelectValues.label,
        icon: data.icon ?? defaultSelectValues.icon,
        withAsterisk: data.withAsterisk ?? defaultSelectValues.withAsterisk,
        labelSize: data?.labelProps?.size ?? defaultSelectValues.labelSize,
        labelWeight:
          data.styles?.label.fontWeight ?? defaultSelectValues.labelWeight,
        labelAlign:
          data.styles?.label.textAlign ?? defaultSelectValues.labelAlign,
        data: data.data ?? defaultSelectValues.data,
        ...data.style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeComponentPropsUpdate(key, value);
  };

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Name"
          size="xs"
          {...form.getInputProps("name")}
          onChange={(e) => {
            form.setFieldValue("name", e.target.value);
            debouncedTreeComponentPropsUpdate("name", e.target.value);
          }}
        />
        <Group noWrap>
          <TextInput
            label="Label"
            size="xs"
            {...form.getInputProps("label")}
            onChange={(e) => {
              setFieldValue("label", e.target.value);
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

        <Group noWrap>
          <Select
            label="Label Align"
            size="xs"
            data={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ]}
            {...form.getInputProps("labelAlign")}
            onChange={(value) => {
              form.setFieldValue("labelAlign", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                styles: { label: { textAlign: value } },
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
        </Group>
        <TextInput
          label="Placeholder"
          size="xs"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            setFieldValue("placeholder", e.target.value);
          }}
        />
        <Select
          label="Type"
          size="xs"
          data={INPUT_TYPES_DATA}
          {...form.getInputProps("type")}
          onChange={(value) => {
            setFieldValue("type", value as string);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            setFieldValue("size", value as string);
          }}
        />

        <SelectOptionsForm
          getValue={() => form.getInputProps("data").value}
          setFieldValue={setFieldValue}
        />
      </Stack>
    </form>
  );
});
