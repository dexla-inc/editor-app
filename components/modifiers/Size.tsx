import { UnitInput } from "@/components/UnitInput";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconResize } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";

export const icon = IconResize;
export const label = "Size";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: {
      width: "",
      height: "",
      minWidth: "",
      minHeight: "",
      maxWidth: "",
      maxHeight: "",
    },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const { style = {} } = selectedComponent.props!;
      form.setValues(style);
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form key={selectedComponent?.id}>
      <Stack spacing="xs">
        <Group noWrap>
          <UnitInput
            label="Width"
            {...form.getInputProps("width")}
            onChange={(value) => {
              form.setFieldValue("width", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { width: value },
              });
            }}
          />
          <UnitInput
            label="Height"
            {...form.getInputProps("height")}
            onChange={(value) => {
              form.setFieldValue("height", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { height: value },
              });
            }}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            label="Min Width"
            {...form.getInputProps("minWidth")}
            onChange={(value) => {
              form.setFieldValue("minWidth", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { minWidth: value },
              });
            }}
          />
          <UnitInput
            label="Min Height"
            {...form.getInputProps("minHeight")}
            onChange={(value) => {
              form.setFieldValue("minHeight", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { minHeight: value },
              });
            }}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            label="Max Width"
            {...form.getInputProps("maxWidth")}
            onChange={(value) => {
              form.setFieldValue("maxWidth", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { maxWidth: value },
              });
            }}
          />
          <UnitInput
            label="Max Height"
            {...form.getInputProps("maxHeight")}
            onChange={(value) => {
              form.setFieldValue("maxHeight", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { maxHeight: value },
              });
            }}
          />
        </Group>
      </Stack>
    </form>
  );
});
