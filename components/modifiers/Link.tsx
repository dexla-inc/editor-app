import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";
import merge from "lodash.merge";

export const icon = IconClick;
export const label = "Link";

export const defaultInputValues = {
  value: "New Link",
  size: "md",
  color: "teal",
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
          "children",
          "size",
          "color",
        ]);

        merge(
          data,
          language !== "default"
            ? selectedComponent?.languages?.[language]?.[currentState]
            : selectedComponent?.states?.[currentState]
        );

        form.setValues({
          value: data.children ?? defaultInputValues.value,
          size: data.size ?? defaultInputValues.size,
          color: data.color ?? defaultInputValues.color,
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
            label="Value"
            size="xs"
            {...form.getInputProps("value")}
            onChange={(e) => {
              form.setFieldValue("value", e.target.value);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                children: e.target.value,
              });
            }}
          />
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                size: value,
              });
            }}
          />
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                color: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  }
);
