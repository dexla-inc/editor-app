import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRadio } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { SizeSelector } from "@/components/SizeSelector";

export const icon = IconRadio;
export const label = "Radio";

export const defaultRadioValues = {
  label: "",
  size: "sm",
  weight: "normal",
  align: "left",
  withAsterisk: false,
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultRadioValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "label",
        "styles",
        "labelProps",
        "withAsterisk",
      ]);

      form.setValues({
        label: data.label ?? defaultRadioValues.label,
        size: data.labelProps?.size ?? defaultRadioValues.size,
        align: data.styles?.label.textAlign ?? defaultRadioValues.align,
        weight: data.styles?.label.fontWeight ?? defaultRadioValues.weight,
        withAsterisk: data.withAsterisk ?? defaultRadioValues.withAsterisk,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Title"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedTreeComponentPropsUpdate("label", e.target.value);
          }}
        />
        <Group noWrap>
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
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                labelProps: { size: value },
              });
            }}
          />
        </Group>
        <Group noWrap>
          <Select
            label="Align"
            size="xs"
            data={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ]}
            {...form.getInputProps("align")}
            onChange={(value) => {
              form.setFieldValue("align", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                styles: { label: { textAlign: value } },
              });
            }}
          />
          <Select
            label="Weight"
            size="xs"
            data={[
              { label: "Normal", value: "normal" },
              { label: "Bold", value: "bold" },
            ]}
            {...form.getInputProps("weight")}
            onChange={(value) => {
              form.setFieldValue("weight", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                styles: { label: { fontWeight: value } },
              });
            }}
          />
        </Group>
      </Stack>
    </form>
  );
});
