import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { UnitInput } from "@/components/UnitInput";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Group, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextSize } from "@tabler/icons-react";
import { useEffect } from "react";
import merge from "lodash.merge";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconTextSize;
export const label = "Text";

export const defaultInputValues = {
  value: "New Text",
  size: "md",
  weight: "normal",
  color: "Black.6",
  lineHeight: "",
  letterSpacing: "",
};

export const Modifier = withModifier(
  ({ selectedComponent, componentProps, language, currentState }) => {
    const form = useForm({
      initialValues: defaultInputValues,
    });

    useEffect(() => {
      if (selectedComponent?.id) {
        const data = pick(componentProps, [
          "children",
          "style",
          "color",
          "size",
          "weight",
        ]);

        merge(
          data,
          language !== "default"
            ? selectedComponent?.languages?.[language]?.[currentState]
            : selectedComponent?.states?.[currentState]
        );

        form.setValues({
          value: data.children ?? defaultInputValues.value,
          color: data.color ?? defaultInputValues.color,
          size: data.size ?? defaultInputValues.size,
          weight: data.weight ?? defaultInputValues.weight,
          ...data.style,
        });
      }
      // Disabling the lint here because we don't want this to be updated every time the form changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent?.id, currentState, language]);

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
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeComponentPropsUpdate("color", value);
            }}
          />
        </Stack>
      </form>
    );
  }
);
