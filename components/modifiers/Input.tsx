import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconForms } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { RangeSliderInput } from "../RangeSliderInput";

export const icon = IconForms;
export const label = "Input";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();
    const theme = useEditorStore((state) => state.theme);

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.input, {
          size: selectedComponent?.props?.size ?? theme.inputSize,
          placeholder: selectedComponent?.props?.placeholder,
          type: selectedComponent?.props?.type,
          icon: selectedComponent?.props?.icon,
          withAsterisk: selectedComponent?.props?.withAsterisk,
          clearable: selectedComponent?.props?.clearable,
          passwordRange: selectedComponent?.props?.passwordRange, // default 8-20. May need two numbers check docs
          passwordNumber: selectedComponent?.props?.passwordNumber ?? true, // default true
          passwordLower: selectedComponent?.props?.passwordLower ?? true, // default true
          passwordUpper: selectedComponent?.props?.passwordUpper ?? true, // default true
          passwordSpecial: selectedComponent?.props?.passwordSpecial ?? false, // default false
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Placeholder"
            size="xs"
            {...form.getInputProps("placeholder")}
            onChange={(e) => {
              form.setFieldValue("placeholder", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                placeholder: e.target.value,
              });
            }}
          />
          <Select
            label="Type"
            size="xs"
            data={INPUT_TYPES_DATA}
            {...form.getInputProps("type")}
            onChange={(value) => {
              form.setFieldValue("type", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                type: value,
              });
            }}
          />
          {/* Has at least 6 characters
Includes number
Includes lowercase letter
Includes uppercase letter
Includes special symbol */}
          {/* Character count: Number Range
Includes number: Yes/No
Includes lowercase letter: Yes/No
Includes uppercase letter: Yes/No
Includes special symbol: Yes/No */}
          {form.values.type === "password" && (
            <>
              {/* Create a new component with label like SegmentedControlInput */}
              <RangeSliderInput
                label="Character range"
                thumbSize={14}
                defaultValue={[8, 20]}
                min={4}
                max={40}
                {...form.getInputProps("passwordRange")}
                onChange={(value) => {
                  form.setFieldValue("passwordRange", value);
                  debouncedTreeUpdate(selectedComponentIds, {
                    passwordRange: value,
                  });
                }}
              />
              <SegmentedControlYesNo
                label="Includes number"
                {...form.getInputProps("passwordNumber")}
                onChange={(value) => {
                  form.setFieldValue("passwordNumber", value);
                  debouncedTreeUpdate(selectedComponentIds, {
                    passwordNumber: value,
                  });
                }}
              />
              <SegmentedControlYesNo
                label="Includes lowercase letter"
                {...form.getInputProps("passwordLower")}
                onChange={(value) => {
                  form.setFieldValue("passwordLower", value);
                  debouncedTreeUpdate(selectedComponentIds, {
                    passwordLower: value,
                  });
                }}
              />
              <SegmentedControlYesNo
                label="Includes uppercase letter"
                {...form.getInputProps("passwordUpper")}
                onChange={(value) => {
                  form.setFieldValue("passwordUpper", value);
                  debouncedTreeUpdate(selectedComponentIds, {
                    passwordUpper: value,
                  });
                }}
              />
              <SegmentedControlYesNo
                label="Includes special letter"
                {...form.getInputProps("passwordSpecial")}
                onChange={(value) => {
                  form.setFieldValue("passwordSpecial", value);
                  debouncedTreeUpdate(selectedComponentIds, {
                    passwordSpecial: value,
                  });
                }}
              />
            </>
          )}
          <SegmentedControlSizes
            label="Size"
            sizing={inputSizes}
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                size: value,
                style: { height: inputSizes[value] },
              });
            }}
          />
          <IconSelector
            topLabel="Icon"
            selectedIcon={(form.values.icon as any)?.props?.name}
            onIconSelect={(iconName: string) => {
              const icon = { props: { name: iconName } };
              form.setFieldValue("icon.props.name", iconName);
              debouncedTreeUpdate(selectedComponentIds, {
                icon,
              });
            }}
          />
          <SegmentedControlYesNo
            label="Required"
            {...form.getInputProps("withAsterisk")}
            onChange={(value) => {
              form.setFieldValue("withAsterisk", value);
              debouncedTreeUpdate(selectedComponentIds, {
                withAsterisk: value,
              });
            }}
          />
          <SegmentedControlYesNo
            label="Clearable"
            {...form.getInputProps("clearable")}
            onChange={(value) => {
              form.setFieldValue("clearable", value);
              debouncedTreeUpdate(selectedComponentIds, {
                clearable: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
