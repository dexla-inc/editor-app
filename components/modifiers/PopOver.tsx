import { debouncedTreeUpdate } from "@/utils/editor";
import { SegmentedControl, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutSidebarLeftCollapse } from "@tabler/icons-react";
import { withModifier } from "@/hoc/withModifier";
import merge from "lodash.merge";

export const icon = IconLayoutSidebarLeftCollapse;
export const label = "PopOver";

export const defaultPopOverValues = {
  title: "PopOver Title",
  position: "left",
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultPopOverValues, {
        title: selectedComponent?.props?.title,
        position: selectedComponent?.props?.position,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <Textarea
            autosize
            label="Title"
            size="xs"
            {...form.getInputProps("title")}
            onChange={(e) => {
              form.setFieldValue("title", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                title: e.target.value,
              });
            }}
          />
          <Stack spacing={2}>
            <Text size="xs" fw={500}>
              Position
            </Text>
            <SegmentedControl
              size="xs"
              data={[
                { label: "Left", value: "left" },
                { label: "Top", value: "top" },
                { label: "Right", value: "right" },
                { label: "Bottom", value: "bottom" },
              ]}
              {...form.getInputProps("position")}
              onChange={(value) => {
                form.setFieldValue("position", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  position: value,
                });
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  },
);
