import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { requiredModifiers } from "@/utils/componentMapper";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { Checkbox, Group, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextSize } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconTextSize;
export const label = "Text";

export const defaultInputValues = {
  value: "New Text",
  size: "md",
  weight: "normal",
  color: "Black.6",
  lineHeight: "",
  letterSpacing: "",
  align: "left",
  hideIfDataIsEmpty: false,
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: { ...requiredModifiers.text },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "children",
        "style",
        "color",
        "size",
        "weight",
        "hideIfDataIsEmpty",
      ]);

      form.setValues({
        value: data.children ?? defaultInputValues.value,
        color: data.color ?? defaultInputValues.color,
        size: data.size ?? defaultInputValues.size,
        weight: data.weight ?? defaultInputValues.weight,
        align: data.style.textAlign ?? defaultInputValues.align,
        hideIfDataIsEmpty:
          data.hideIfDataIsEmpty ?? defaultInputValues.hideIfDataIsEmpty,
        ...data.style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <Textarea
          autosize
          label="Value"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            debouncedTreeComponentPropsUpdate("children", e.target.value);
          }}
        />
        <Checkbox
          size="xs"
          label="Hide text with data is empty"
          {...form.getInputProps("hideIfDataIsEmpty", { type: "checkbox" })}
          onChange={(e) => {
            form.setFieldValue("hideIfDataIsEmpty", e.target.checked);
            debouncedTreeComponentPropsUpdate(
              "hideIfDataIsEmpty",
              e.target.checked,
            );
          }}
        />
        <Group noWrap>
          <SizeSelector
            label="Size"
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeComponentPropsUpdate("size", value);
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
              debouncedTreeComponentPropsUpdate("weight", value);
            }}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            label="Line Height"
            {...form.getInputProps("lineHeight")}
            onChange={(value) => {
              form.setFieldValue("lineHeight", value as string);
              debouncedTreeComponentPropsUpdate("style", {
                lineHeight: value,
              });
            }}
          />
          <UnitInput
            label="Letter Spacing"
            disabledUnits={["%"]}
            {...form.getInputProps("letterSpacing")}
            onChange={(value) => {
              form.setFieldValue("letterSpacing", value as string);
              debouncedTreeComponentPropsUpdate("style", {
                letterSpacing: value,
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
                style: { textAlign: value },
              });
            }}
          />
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeComponentPropsUpdate("color", value);
            }}
          />
        </Group>
      </Stack>
    </form>
  );
});
