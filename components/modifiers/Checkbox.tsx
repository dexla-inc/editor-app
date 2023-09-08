import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Checkbox, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheckbox } from "@tabler/icons-react";
import { useEffect } from "react";
import { pick } from "next/dist/lib/pick";
import merge from "lodash.merge";
import { withModifier } from "@/hoc/withModifier";

export const icon = IconCheckbox;
export const label = "Checkbox";

export const defaultInputValues = {
  label: "A label",
  checked: false,
  size: "sm",
  withAsterisk: false,
  labelSpacing: "0",
};

export const Modifier = withModifier(
  ({ selectedComponent, componentProps, language, currentState }) => {
    const form = useForm({
      initialValues: defaultInputValues,
    });

    useEffect(() => {
      if (selectedComponent?.id) {
        const data = pick(componentProps, [
          "style",
          "label",
          "size",
          "withAsterisk",
          "checked",
          "labelProps",
        ]);

        merge(
          data,
          language !== "default"
            ? selectedComponent?.languages?.[language]?.[currentState]
            : selectedComponent?.states?.[currentState]
        );

        form.setValues({
          size: data.size ?? defaultInputValues.size,
          label: data.label ?? defaultInputValues.label,
          withAsterisk: data.withAsterisk ?? defaultInputValues.withAsterisk,
          checked: data.checked ?? defaultInputValues.checked,
          labelProps:
            data.labelProps?.style?.marginBottom ??
            defaultInputValues.labelSpacing,
          ...data.style,
        });
      }
      // Disabling the lint here because we don't want this to be updated every time the form changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent?.id, currentState, language]);

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
          <Checkbox
            label="Checked"
            size="xs"
            {...form.getInputProps("checked")}
            onChange={(e) => {
              form.setFieldValue("checked", e.currentTarget.checked);
              debouncedTreeComponentPropsUpdate(
                "checked",
                e.currentTarget.checked
              );
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
                event.currentTarget.checked
              );
            }}
          />
          <SizeSelector
            label="Label Spacing"
            {...form.getInputProps("labelProps")}
            onChange={(value) => {
              form.setFieldValue("labelProps", value as string);
              debouncedTreeComponentPropsUpdate("labelProps", {
                mb: value as string,
              });
            }}
          />
        </Stack>
      </form>
    );
  }
);
