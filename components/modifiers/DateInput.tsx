import { IconSelector } from "@/components/IconSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlInput } from "../SegmentedControlInput";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";
import { ThemeColorSelector } from "../ThemeColorSelector";
import { SegmentedControlSizes } from "../SegmentedControlSizes";
import { inputSizes } from "@/utils/defaultSizes";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.dateInput, {
        placeholder: selectedComponent?.props?.placeholder,
        description: selectedComponent?.props?.description,
        radius: selectedComponent?.props?.radius,
        size: selectedComponent?.props?.size,
        withAsterisk: selectedComponent?.props?.withAsterisk,
        clearable: selectedComponent?.props?.clearable,
        icon: selectedComponent?.props?.icon,
        iconPosition: selectedComponent?.props?.iconPosition,
        textColor: selectedComponent?.props?.textColor,
        bg: selectedComponent?.props?.bg,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          size="xs"
          label="Placeholder"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            form.setFieldValue("placeholder", e.target.value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { placeholder: e.target.value } },
            });
          }}
        />
        <SegmentedControlSizes
          label="Size"
          sizing={inputSizes}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { size: value } },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(value) => {
            form.setFieldValue("withAsterisk", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  withAsterisk: value,
                },
              },
            });
          }}
        />
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  bg: value,
                },
              },
            });
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("textColor")}
          onChange={(value: string) => {
            form.setFieldValue("textColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  textColor: value,
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
              attrs: { props: { icon: value } },
            });
          }}
        />
        <SegmentedControlInput
          label="Icon Position"
          size="xs"
          data={[
            {
              label: "Left",
              value: "left",
            },
            {
              label: "Right",
              value: "right",
            },
          ]}
          {...form.getInputProps("iconPosition")}
          onChange={(value) => {
            form.setFieldValue("iconPosition", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { iconPosition: value as string } },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(value) => {
            form.setFieldValue("withAsterisk", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { withAsterisk: value } },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Clearable"
          {...form.getInputProps("clearable")}
          onChange={(value) => {
            form.setFieldValue("clearable", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { clearable: value } },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Disabled"
          {...form.getInputProps("disabled")}
          onChange={(value) => {
            form.setFieldValue("disabled", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { disabled: value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
