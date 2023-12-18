import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconResize } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconResize;
export const label = "Size";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
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
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { width: value },
                });
              }}
            />
            <UnitInput
              modifierType="size"
              label="Height"
              {...form.getInputProps("height")}
              onChange={(value) => {
                form.setFieldValue("height", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { height: value },
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
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { minWidth: value },
                });
              }}
            />
            <UnitInput
              label="Min Height"
              modifierType="size"
              {...form.getInputProps("minHeight")}
              onChange={(value) => {
                form.setFieldValue("minHeight", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { minHeight: value },
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
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { maxWidth: value },
                });
              }}
            />
            <UnitInput
              label="Max Height"
              modifierType="size"
              {...form.getInputProps("maxHeight")}
              onChange={(value) => {
                form.setFieldValue("maxHeight", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { maxHeight: value },
                });
              }}
            />
          </Group>
        </Stack>
      </form>
    );
  },
);
