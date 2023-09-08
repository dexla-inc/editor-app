import { Icon } from "@/components/Icon";
import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconForms } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";
import merge from "lodash.merge";

export const icon = IconForms;
export const label = "Input";

export const defaultInputValues = {
  size: "sm",
  placeholder: "Input",
  type: "text",
  label: "",
  icon: "",
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
          "placeholder",
          "type",
          "icon",
          "withAsterisk",
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
          placeholder: data.placeholder ?? defaultInputValues.placeholder,
          type: data.type ?? defaultInputValues.type,
          label: data.label ?? defaultInputValues.label,
          icon: data.icon ?? defaultInputValues.icon,
          withAsterisk: data.withAsterisk ?? defaultInputValues.withAsterisk,
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
          <IconSelector
            topLabel="Icon"
            selectedIcon={form.values.icon}
            onIconSelect={(iconName: string) => {
              form.setFieldValue("icon", iconName);
              debouncedTreeComponentPropsUpdate(
                "icon",
                <Icon name={iconName} />
              );
            }}
          />
        </Stack>
      </form>
    );
  }
);
