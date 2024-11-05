import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.tabs, {
        defaultValue: selectedComponent?.props?.defaultValue,
        variant: selectedComponent?.props?.variant,
        orientation: selectedComponent?.props?.orientation,
        radius: selectedComponent?.props?.radius,
        color: selectedComponent?.props?.color,
        grow: selectedComponent?.props?.grow,
        tabBgColor: selectedComponent?.props?.tabsBgColor,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Default Value"
          size="xs"
          {...form.getInputProps("defaultValue")}
          onChange={(e) => {
            form.setFieldValue("defaultValue", e.target.value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { defaultValue: e.target.value } },
            });
          }}
        />
        <Group noWrap>
          <Select
            label="Variant"
            size="xs"
            data={[
              { label: "Default", value: "default" },
              { label: "Outline", value: "outline" },
              { label: "Pills", value: "pills" },
            ]}
            {...form.getInputProps("variant")}
            onChange={(value) => {
              form.setFieldValue("variant", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { variant: value } },
              });
            }}
          />
          <SizeSelector
            label="Radius"
            {...form.getInputProps("radius")}
            onChange={(value) => {
              form.setFieldValue("radius", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { radius: value } },
              });
            }}
          />
        </Group>
        <Select
          label="Orientation"
          size="xs"
          data={[
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ]}
          {...form.getInputProps("orientation")}
          onChange={(value) => {
            form.setFieldValue("orientation", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { orientation: value } },
            });
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { color: value } },
            });
          }}
        />
        <ThemeColorSelector
          label="Tab Item Hover Color"
          {...form.getInputProps("tabsBgColor")}
          onChange={(value: string) => {
            form.setFieldValue("tabsBgColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { tabsBgColor: value } },
            });
          }}
        />
        <SwitchSelector
          topLabel="Grow"
          {...form.getInputProps("grow")}
          onChange={(event) => {
            form.setFieldValue("grow", event.currentTarget.checked);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { grow: event.currentTarget.checked } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
