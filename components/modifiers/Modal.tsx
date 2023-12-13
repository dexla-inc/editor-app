import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Checkbox, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconBoxModel;
export const label = "Modal";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, requiredModifiers.modal, {
        title: selectedComponent?.props?.title,
        forceHide: selectedComponent?.props?.forceHide,
        fullScreen: selectedComponent?.props?.fullScreen,
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
          <Checkbox
            size="xs"
            label="Force Hide"
            {...form.getInputProps("forceHide", { type: "checkbox" })}
            onChange={(e) => {
              form.setFieldValue("forceHide", e.target.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                forceHide: e.target.checked,
              });
            }}
          />

          <Checkbox
            size="xs"
            label="Full Screen"
            {...form.getInputProps("fullScreen", { type: "checkbox" })}
            onChange={(e) => {
              form.setFieldValue("fullScreen", e.target.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                fullScreen: e.target.checked,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
