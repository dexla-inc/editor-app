import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { SizeSelector } from "@/components/SizeSelector";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSelect } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconSelect;
export const label = "Select";

export const defaultSelectValues = {
  size: "sm",
  placeholder: "Input",
  type: "text",
  label: "A label",
  icon: "",
  withAsterisk: false,
  labelSpacing: "0",
  data: [
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
        "style",
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
        size: data.size ?? defaultSelectValues.size,
        placeholder: data.placeholder ?? defaultSelectValues.placeholder,
        type: data.type ?? defaultSelectValues.type,
        label: data.label ?? defaultSelectValues.label,
        icon: data.icon ?? defaultSelectValues.icon,
        withAsterisk: data.withAsterisk ?? defaultSelectValues.withAsterisk,
        labelProps:
          data.labelProps.style?.marginBottom ??
          defaultSelectValues.labelSpacing,
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
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            setFieldValue("label", e.target.value);
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

        <SizeSelector
          label="Label Spacing"
          {...form.getInputProps("labelProps")}
          onChange={(value) => {
            setFieldValue("labelProps", value as string);
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
