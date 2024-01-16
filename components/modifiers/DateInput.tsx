import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconForms } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlInput } from "../SegmentedControlInput";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

export const icon = IconForms;
export const label = "Date Input";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.dateInput, {
          type: selectedComponent?.props?.type,
          placeholder: selectedComponent?.props?.placeholder,
          description: selectedComponent?.props?.description,
          radius: selectedComponent?.props?.radius,
          size: selectedComponent?.props?.size,
          disabled: selectedComponent?.props?.isDisabled,
          withAsterisk: selectedComponent?.props?.withAsterisk,
          clearable: selectedComponent?.props?.clearable,
          valueFormat: selectedComponent?.props?.valueFormat,
          icon: selectedComponent?.props?.icon,
          iconPosition: selectedComponent?.props?.iconPosition,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <Stack spacing={2}>
            <TopLabel text="Type" />
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: "Default",
                  value: "default",
                },
                {
                  label: "Multiple",
                  value: "multiple",
                },
                {
                  label: "Range",
                  value: "range",
                },
              ]}
              {...form.getInputProps("type")}
              onChange={(value) => {
                form.setFieldValue("type", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  type: value as string,
                });
              }}
            />
          </Stack>
          <Select
            label="Format"
            size="xs"
            data={[
              { label: "DD MMM YYYY", value: "DD MMM YYYY" },
              { label: "DD MM YYYY", value: "DD MM YYYY" },
              { label: "MM DD YYYY", value: "MM DD YYYY" },
            ]}
            {...form.getInputProps("valueFormat")}
            onChange={(value) => {
              form.setFieldValue("valueFormat", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                valueFormat: value,
              });
            }}
          />
          <TextInput
            size="xs"
            label="Placeholder"
            {...form.getInputProps("placeholder")}
            onChange={(e) => {
              form.setFieldValue("placeholder", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                placeholder: e.target.value,
              });
            }}
          />
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(e) => {
              form.setFieldValue("size", e);
              debouncedTreeUpdate(selectedComponentIds, {
                size: e,
              });
            }}
          />
          <SizeSelector
            label="Radius"
            {...form.getInputProps("radius")}
            onChange={(e) => {
              form.setFieldValue("radius", e);
              debouncedTreeUpdate(selectedComponentIds, {
                radius: e,
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
              debouncedTreeUpdate(selectedComponentIds, {
                iconPosition: value as string,
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
          <SegmentedControlYesNo
            label="Disabled"
            {...form.getInputProps("disabled")}
            onChange={(value) => {
              form.setFieldValue("disabled", value);
              debouncedTreeUpdate(selectedComponentIds, {
                disabled: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
