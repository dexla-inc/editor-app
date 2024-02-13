import { IconSelector } from "@/components/IconSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { useChangeState } from "@/hooks/useChangeState";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconClick;
export const label = "Nav Link";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds, currentState }) => {
    const form = useForm();
    const { setBackgroundColor } = useChangeState({});

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.navLink, {
          icon: selectedComponent?.props?.icon,
          bg: selectedComponent?.props?.bg ?? "transparent",
          color: selectedComponent?.props?.color,
          iconColor:
            selectedComponent?.props?.iconColor ??
            selectedComponent?.props?.color,
          textAlign: selectedComponent?.props?.style?.textAlign,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <Select
            label="Align"
            size="xs"
            data={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ]}
            {...form.getInputProps("textAlign")}
            onChange={(value) => {
              form.setFieldValue("textAlign", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                style: { textAlign: value },
              });
            }}
          />
          <ThemeColorSelector
            label="Background Color"
            {...form.getInputProps("bg")}
            onChange={(value: string) =>
              setBackgroundColor(
                "bg",
                value,
                form,
                currentState,
                selectedComponent,
              )
            }
          />
          <ThemeColorSelector
            label="Text Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponentIds, {
                color: value,
              });
            }}
          />
          <IconSelector
            topLabel="Icon"
            selectedIcon={form.values.icon as string}
            onIconSelect={(value: string) => {
              form.setFieldValue("icon", value);
              debouncedTreeUpdate(selectedComponentIds, {
                icon: value,
              });
            }}
          />
          <ThemeColorSelector
            label="Icon Color"
            {...form.getInputProps("iconColor")}
            onChange={(value: string) => {
              form.setFieldValue("iconColor", value);
              debouncedTreeUpdate(selectedComponentIds, {
                iconColor: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
