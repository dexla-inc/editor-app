import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { SegmentedControl, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutSidebarLeftCollapse } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";
import merge from "lodash.merge";

export const icon = IconLayoutSidebarLeftCollapse;
export const label = "PopOver";

export const defaultPopOverValues = {
  title: "PopOver Title",
  position: "left",
};

export const Modifier = withModifier(
  ({ selectedComponent, componentProps, language, currentState }) => {
    const form = useForm({
      initialValues: {
        title: defaultPopOverValues.title,
        position: defaultPopOverValues.position,
      },
    });

    useEffect(() => {
      if (selectedComponent?.id) {
        const data = pick(componentProps, ["title", "position"]);

        merge(
          data,
          language !== "default"
            ? selectedComponent?.languages?.[language]?.[currentState]
            : selectedComponent?.states?.[currentState]
        );

        form.setValues({
          title: data.title ?? defaultPopOverValues.title,
          position: data.position ?? defaultPopOverValues.position,
        });
      }
      // Disabling the lint here because we don't want this to be updated every time the form changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent?.id, currentState, language]);

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
              debouncedTreeComponentPropsUpdate("title", e.target.value);
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
                debouncedTreeComponentPropsUpdate("position", value);
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  }
);
