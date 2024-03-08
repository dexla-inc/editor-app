import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.size, {
        width: selectedComponent.props?.style?.width,
        height: selectedComponent.props?.style?.height,
        minWidth: selectedComponent.props?.style?.minWidth,
        minHeight: selectedComponent.props?.style?.minHeight,
        maxWidth: selectedComponent.props?.style?.maxWidth,
        maxHeight: selectedComponent.props?.style?.maxHeight,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form key={selectedComponent?.id}>
      <Stack spacing="xs">
        <Group noWrap>
          <UnitInput
            modifierType="size"
            label="Width"
            {...form.getInputProps("width")}
            onChange={(value) => {
              form.setFieldValue("width", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { style: { width: value } } },
              });
            }}
          />
          <UnitInput
            modifierType="size"
            label="Height"
            {...form.getInputProps("height")}
            onChange={(value) => {
              form.setFieldValue("height", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { style: { height: value } } },
              });
            }}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            label="Min Width"
            modifierType="size"
            {...form.getInputProps("minWidth")}
            onChange={(value) => {
              form.setFieldValue("minWidth", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { style: { minWidth: value } } },
              });
            }}
          />
          <UnitInput
            label="Min Height"
            modifierType="size"
            {...form.getInputProps("minHeight")}
            onChange={(value) => {
              form.setFieldValue("minHeight", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { style: { minHeight: value } } },
              });
            }}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            modifierType="size"
            label="Max Width"
            {...form.getInputProps("maxWidth")}
            onChange={(value) => {
              form.setFieldValue("maxWidth", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { style: { maxWidth: value } } },
              });
            }}
          />
          <UnitInput
            label="Max Height"
            modifierType="size"
            {...form.getInputProps("maxHeight")}
            onChange={(value) => {
              form.setFieldValue("maxHeight", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { style: { maxHeight: value } } },
              });
            }}
          />
        </Group>
      </Stack>
    </form>
  );
});

export default Modifier;
