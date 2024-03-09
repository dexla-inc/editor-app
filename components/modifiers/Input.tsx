import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { withModifier } from "@/hoc/withModifier";
import { useThemeStore } from "@/stores/theme";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { RangeSliderInput } from "../RangeSliderInput";
const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useThemeStore((state) => state.theme);
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.input, {
        size: selectedComponent?.props?.size ?? theme.inputSize,
        placeholder: selectedComponent?.props?.placeholder,
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
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  placeholder: e.target.value,
                },
              },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  type: value,
                },
              },
            });
          }}
        />
        {form.values.type === "password" && (
          <>
            <SegmentedControlYesNo
              label="Display"
              {...form.getInputProps("displayRequirements")}
              onChange={(value) => {
                form.setFieldValue("displayRequirements", value);
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      displayRequirements: value,
                    },
                  },
                });
              }}
            />
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
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      passwordRange: value,
                    },
                  },
                });
              }}
            />
            <SegmentedControlYesNo
              label="Includes number"
              {...form.getInputProps("passwordNumber")}
              onChange={(value) => {
                form.setFieldValue("passwordNumber", value);
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      passwordNumber: value,
                    },
                  },
                });
              }}
            />
            <SegmentedControlYesNo
              label="Includes lowercase letter"
              {...form.getInputProps("passwordLower")}
              onChange={(value) => {
                form.setFieldValue("passwordLower", value);
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      passwordLower: value,
                    },
                  },
                });
              }}
            />
            <SegmentedControlYesNo
              label="Includes uppercase letter"
              {...form.getInputProps("passwordUpper")}
              onChange={(value) => {
                form.setFieldValue("passwordUpper", value);
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      passwordUpper: value,
                    },
                  },
                });
              }}
            />
            <SegmentedControlYesNo
              label="Includes special letter"
              {...form.getInputProps("passwordSpecial")}
              onChange={(value) => {
                form.setFieldValue("passwordSpecial", value);
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      passwordSpecial: value,
                    },
                  },
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
            form.setFieldValue("icon.props.name", iconName);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  icon,
                },
              },
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
        <SegmentedControlYesNo
          label="Clearable"
          {...form.getInputProps("clearable")}
          onChange={(value) => {
            form.setFieldValue("clearable", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  clearable: value,
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
