import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlInput } from "../SegmentedControlInput";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.dateInput, {
        type: selectedComponent?.props?.type,
        placeholder: selectedComponent?.props?.placeholder,
        description: selectedComponent?.props?.description,
        radius: selectedComponent?.props?.radius,
        size: selectedComponent?.props?.size,
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
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { type: value } },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { valueFormat: value } },
            });
          }}
        />
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
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(e) => {
            form.setFieldValue("size", e);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { size: e } },
            });
          }}
        />
        <SizeSelector
          label="Radius"
          {...form.getInputProps("radius")}
          onChange={(e) => {
            form.setFieldValue("radius", e);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { radius: e } },
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
