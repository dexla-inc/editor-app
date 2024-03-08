import { IconSelector } from "@/components/IconSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { useChangeState } from "@/hooks/useChangeState";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
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
  const { setBackgroundColor } = useChangeState({});

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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: { textAlign: value } } },
            });
          }}
        />
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) =>
            setBackgroundColor("bg", value, form, selectedComponent)
          }
        />
        <ThemeColorSelector
          label="Text Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  color: value,
                },
              },
            });
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.icon as string}
          onIconSelect={(value: string) => {
            form.setFieldValue("icon", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  icon: value,
                },
              },
            });
          }}
        />
        <ThemeColorSelector
          label="Icon Color"
          {...form.getInputProps("iconColor")}
          onChange={(value: string) => {
            form.setFieldValue("iconColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  iconColor: value,
                },
              },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
