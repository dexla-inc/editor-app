import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconClick;
export const label = "Button";

export const defaultButtonValues = requiredModifiers.button;

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultButtonValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "style",
        "children",
        "type",
        "size",
        "color",
        "variant",
        "textColor",
        "leftIcon",
        "compact",
      ]);

      form.setValues({
        ...data.style,
        value: data.children ?? defaultButtonValues.value,
        type: data.type ?? defaultButtonValues.type,
        variant: data.variant ?? defaultButtonValues.variant,
        size: data.size ?? defaultButtonValues.size,
        color: data.color ?? defaultButtonValues.color,
        textColor: data.textColor ?? defaultButtonValues.textColor,
        icon: data.leftIcon ?? defaultButtonValues.leftIcon,
        compact: data.compact ?? defaultButtonValues.compact,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Value"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            debouncedTreeComponentPropsUpdate("children", e.target.value);
          }}
        />
        <SwitchSelector
          topLabel="Compact"
          {...form.getInputProps("compact")}
          onChange={(event) => {
            form.setFieldValue("compact", event.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "compact",
              event.currentTarget.checked,
            );
          }}
        />
        <Select
          label="Type"
          size="xs"
          data={[
            { label: "button", value: "button" },
            { label: "submit", value: "submit" },
          ]}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as string);
            debouncedTreeComponentPropsUpdate("type", value as string);
          }}
        />
        <Select
          label="Variant"
          size="xs"
          data={[
            { label: "Filled", value: "filled" },
            { label: "Light", value: "light" },
            { label: "Outline", value: "outline" },
            { label: "Default", value: "default" },
            { label: "Subtle", value: "subtle" },
          ]}
          {...form.getInputProps("variant")}
          onChange={(value) => {
            form.setFieldValue("variant", value as string);
            debouncedTreeComponentPropsUpdate("variant", value as string);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value as string);
          }}
        />
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentPropsUpdate("color", value);
          }}
        />
        <ThemeColorSelector
          label="Text Color"
          {...form.getInputProps("textColor")}
          onChange={(value: string) => {
            form.setFieldValue("textColor", value);
            debouncedTreeComponentPropsUpdate("textColor", value);
          }}
        />

        {/* Adding a react component as a property doesn't work -
        Error: Objects are not valid as a React child (found: object with keys {key, ref, props, _owner, _store}). 
        If you meant to render a collection of children, use an array instead. */}
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.leftIcon}
          onIconSelect={(value: string) => {
            form.setFieldValue("leftIcon", value);
            debouncedTreeComponentPropsUpdate("leftIcon", value);
          }}
        />
      </Stack>
    </form>
  );
});
