import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { withModifier } from "@/hoc/withModifier";
import { useThemeStore } from "@/stores/theme";
import { INPUT_TYPES_DATA } from "@/types/dashboardTypes";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { RangeSliderInput } from "../RangeSliderInput";
import { ThemeColorSelector } from "../ThemeColorSelector";
import { SegmentedControlInput } from "../SegmentedControlInput";

const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useThemeStore((state) => state.theme);
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.input, {
        size: selectedComponent?.props?.size ?? theme.inputSize,
        type: selectedComponent?.props?.type,
        icon: selectedComponent?.props?.icon,
        withAsterisk: selectedComponent?.props?.withAsterisk,
        clearable: selectedComponent?.props?.clearable,
        displayRequirements:
          selectedComponent?.props?.displayRequirements ?? false,
        passwordRange: selectedComponent?.props?.passwordRange,
        passwordNumber: selectedComponent?.props?.passwordNumber,
        passwordLower: selectedComponent?.props?.passwordLower,
        passwordUpper: selectedComponent?.props?.passwordUpper,
        passwordSpecial: selectedComponent?.props?.passwordSpecial,
        bg: selectedComponent?.props?.bg,
        hideControls: selectedComponent?.props?.hideControls ?? false,
        maxLength: selectedComponent?.props?.maxLength,
        pattern: selectedComponent?.props?.pattern,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const type = form.values.type;
  const onChange = (attr: string, value: any) => {
    form.setFieldValue(attr, value);
    debouncedTreeComponentAttrsUpdate({
      attrs: {
        props: {
          [attr]: value,
        },
      },
    });
  };

  return (
    <form>
      <Stack spacing="xs">
        <Select
          label="Type"
          size="xs"
          data={INPUT_TYPES_DATA}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  type: value,
                  pattern: ["number", "numberRange"].includes(value as string)
                    ? "numbers"
                    : "all",
                },
              },
            });
          }}
        />
        {type === "number" && (
          <SegmentedControlYesNo
            label="Hide controls"
            {...form.getInputProps("hideControls")}
            onChange={(value) => onChange("hideControls", value)}
          />
        )}
        {!["password", "number", "numberRange"].includes(type as string) && (
          <>
            <SegmentedControlInput
              label="Character Type"
              {...form.getInputProps("pattern")}
              data={[
                { label: "All", value: "all" },
                { label: "Alphabets", value: "alphabets" },
                { label: "Numbers", value: "numbers" },
              ]}
              onChange={(value) => onChange("pattern", value)}
            />
            <NumberInput
              label="Max Length"
              hideControls
              {...form.getInputProps("maxLength")}
              onChange={(value) => onChange("maxLength", value)}
            />
          </>
        )}
        <SegmentedControlYesNo
          label="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(value) => onChange("withAsterisk", value)}
        />
        {type === "password" && (
          <>
            <SegmentedControlYesNo
              label="Display"
              {...form.getInputProps("displayRequirements")}
              onChange={(value) => onChange("displayRequirements", value)}
            />
            {/* Create a new component with label like SegmentedControlInput */}
            <RangeSliderInput
              label="Character range"
              thumbSize={14}
              defaultValue={[8, 20]}
              min={4}
              max={40}
              {...form.getInputProps("passwordRange")}
              onChange={(value) => onChange("passwordRange", value)}
            />
            <SegmentedControlYesNo
              label="Includes number"
              {...form.getInputProps("passwordNumber")}
              onChange={(value) => onChange("passwordNumber", value)}
            />
            <SegmentedControlYesNo
              label="Includes lowercase letter"
              {...form.getInputProps("passwordLower")}
              onChange={(value) => onChange("passwordLower", value)}
            />
            <SegmentedControlYesNo
              label="Includes uppercase letter"
              {...form.getInputProps("passwordUpper")}
              onChange={(value) => onChange("passwordUpper", value)}
            />
            <SegmentedControlYesNo
              label="Includes special letter"
              {...form.getInputProps("passwordSpecial")}
              onChange={(value) => onChange("passwordSpecial", value)}
            />
          </>
        )}
        <SegmentedControlSizes
          label="Size"
          sizing={inputSizes}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  size: value,
                  style: { height: inputSizes[value] },
                },
              },
            });
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={(form.values.icon as any)?.props?.name}
          onIconSelect={(iconName: string) => {
            const icon = { props: { name: iconName } };
            onChange("icon", icon);
          }}
        />
        <SegmentedControlYesNo
          label="Clearable"
          {...form.getInputProps("clearable")}
          onChange={(value) => onChange("clearable", value)}
        />
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => onChange("bg", value)}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
